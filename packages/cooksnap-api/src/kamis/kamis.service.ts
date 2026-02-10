import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { findKamisItem } from './kamis-item-map';
import { PrismaService } from '../prisma/prisma.service';

export interface PriceResult {
  ingredientId: string;
  name: string;
  price: number | null;
  unit: string | null;
}

// 인메모리 캐시 (6시간 TTL)
const priceCache = new Map<string, { price: number; expiry: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6시간

@Injectable()
export class KamisService {
  private readonly logger = new Logger(KamisService.name);
  private readonly apiKey: string;
  private readonly apiId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get<string>('kamis.apiKey') || '';
    this.apiId = this.configService.get<string>('kamis.apiId') || '';
  }

  // 레시피의 재료별 시세 조회
  getRecipePrices = async (recipeId: string): Promise<PriceResult[]> => {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!recipe) return [];

    const results: PriceResult[] = [];

    for (const ingredient of recipe.ingredients) {
      const kamisItem = findKamisItem(ingredient.name);

      if (!kamisItem) {
        results.push({
          ingredientId: ingredient.id,
          name: ingredient.name,
          price: null,
          unit: ingredient.unit,
        });
        continue;
      }

      const price = await this.fetchPrice(kamisItem.itemCode, kamisItem.kindCode);

      results.push({
        ingredientId: ingredient.id,
        name: ingredient.name,
        price,
        unit: kamisItem.unit,
      });

      // DB에 가격 업데이트
      if (price !== null) {
        await this.prisma.ingredient.update({
          where: { id: ingredient.id },
          data: {
            estimatedPrice: price,
            kamisItemCode: kamisItem.itemCode,
          },
        });
      }
    }

    // 총 재료비 업데이트
    const totalPrice = results.reduce((sum, r) => sum + (r.price || 0), 0);
    if (totalPrice > 0) {
      await this.prisma.recipe.update({
        where: { id: recipeId },
        data: { totalPrice },
      });
    }

    return results;
  };

  // KAMIS API 호출 (캐시 포함)
  private fetchPrice = async (itemCode: string, kindCode: string): Promise<number | null> => {
    const cacheKey = `${itemCode}-${kindCode}`;
    const cached = priceCache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return cached.price;
    }

    if (!this.apiKey || !this.apiId) {
      this.logger.warn('KAMIS API 키가 설정되지 않았습니다.');
      return null;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get('https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList', {
        params: {
          p_cert_key: this.apiKey,
          p_cert_id: this.apiId,
          p_returntype: 'json',
          p_product_cls_code: '01', // 소매
          p_item_code: itemCode,
          p_kind_code: kindCode,
          p_regday: today,
          p_convert_kg_yn: 'N',
        },
        timeout: 5000,
      });

      const data = response.data;
      if (data?.data?.item?.[0]?.dpr1) {
        const priceStr = data.data.item[0].dpr1.replace(/,/g, '');
        const price = parseInt(priceStr, 10);

        if (!isNaN(price)) {
          priceCache.set(cacheKey, { price, expiry: Date.now() + CACHE_TTL });
          return price;
        }
      }

      return null;
    } catch (error) {
      this.logger.error(`KAMIS API 호출 실패: ${itemCode}`, error);
      return null;
    }
  };
}
