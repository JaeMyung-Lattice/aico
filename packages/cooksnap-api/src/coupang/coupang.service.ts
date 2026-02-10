import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import CryptoJS from 'crypto-js';
import axios from 'axios';

export interface PurchaseLinkResult {
  ingredientId: string;
  ingredientName: string;
  productName: string | null;
  price: number | null;
  imageUrl: string | null;
  purchaseUrl: string;
}

// 쿠팡 상품 캐시 (24시간 TTL)
const productCache = new Map<string, { data: PurchaseLinkResult; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간

@Injectable()
export class CoupangService {
  private readonly logger = new Logger(CoupangService.name);
  private readonly accessKey: string;
  private readonly secretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.accessKey = this.configService.get<string>('coupang.accessKey') || '';
    this.secretKey = this.configService.get<string>('coupang.secretKey') || '';
  }

  // 레시피의 재료별 구매 링크 생성
  getPurchaseLinks = async (recipeId: string): Promise<PurchaseLinkResult[]> => {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!recipe) return [];

    const results: PurchaseLinkResult[] = [];

    for (const ingredient of recipe.ingredients) {
      // 캐시 확인
      const cached = productCache.get(ingredient.name);
      if (cached && cached.expiry > Date.now()) {
        results.push({ ...cached.data, ingredientId: ingredient.id });
        continue;
      }

      // MVP 초기: 쿠팡 검색 URL 직접 생성 (API 활성화 전)
      const searchUrl = this.generateSearchUrl(ingredient.name);

      const result: PurchaseLinkResult = {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        productName: null,
        price: null,
        imageUrl: null,
        purchaseUrl: searchUrl,
      };

      // 쿠팡파트너스 API가 활성화된 경우 상품 검색
      if (this.accessKey && this.secretKey) {
        try {
          const product = await this.searchProduct(ingredient.name);
          if (product) {
            result.productName = product.productName;
            result.price = product.price;
            result.imageUrl = product.imageUrl;
            result.purchaseUrl = product.purchaseUrl;
          }
        } catch {
          this.logger.warn(`쿠팡 검색 실패: ${ingredient.name}`);
        }
      }

      productCache.set(ingredient.name, { data: result, expiry: Date.now() + CACHE_TTL });

      // DB에 구매 링크 저장
      await this.prisma.ingredient.update({
        where: { id: ingredient.id },
        data: { coupangProductUrl: result.purchaseUrl },
      });

      results.push(result);
    }

    return results;
  };

  // 쿠팡 검색 URL 직접 생성 (MVP 초기 전략)
  private generateSearchUrl = (keyword: string): string => {
    const encoded = encodeURIComponent(keyword);
    return `https://www.coupang.com/np/search?component=&q=${encoded}`;
  };

  // 쿠팡파트너스 Search API 호출
  private searchProduct = async (keyword: string): Promise<{
    productName: string;
    price: number;
    imageUrl: string;
    purchaseUrl: string;
  } | null> => {
    const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search';
    const method = 'GET';

    const signature = this.generateSignature(method, path);

    try {
      const response = await axios.get(`https://api-gateway.coupang.com${path}`, {
        params: {
          keyword,
          limit: 1,
        },
        headers: {
          Authorization: signature,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      const products = response.data?.data?.productData;
      if (products?.length > 0) {
        const product = products[0];
        return {
          productName: product.productName,
          price: product.productPrice,
          imageUrl: product.productImage,
          purchaseUrl: product.productUrl,
        };
      }

      return null;
    } catch (error) {
      this.logger.error(`쿠팡 API 호출 실패: ${keyword}`, error);
      return null;
    }
  };

  // HMAC 서명 생성
  private generateSignature = (method: string, path: string): string => {
    const datetime = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';
    const message = `${datetime}${method}${path}`;
    const signature = CryptoJS.HmacSHA256(message, this.secretKey).toString(CryptoJS.enc.Hex);
    return `CEA algorithm=HmacSHA256, access-key=${this.accessKey}, signed-date=${datetime}, signature=${signature}`;
  };
}
