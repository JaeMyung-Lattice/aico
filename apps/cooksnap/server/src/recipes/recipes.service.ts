import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';

// 영상 플랫폼 판별
const detectPlatform = (url: string): string => {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'unknown';
};

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  // 영상 URL 분석 → 레시피 생성
  analyze = async (url: string, userId: string | null = null): Promise<{ id: string }> => {
    // 이미 분석된 URL인지 확인 (중복 방지)
    const existing = await this.prisma.recipe.findFirst({
      where: { videoUrl: url },
      select: { id: true },
    });

    if (existing) {
      this.logger.log(`이미 분석된 URL: ${url} → ${existing.id}`);
      await this.createHistory(existing.id, url, userId);
      return { id: existing.id };
    }

    const platform = detectPlatform(url);

    // Gemini에 URL 직접 전달하여 영상 분석
    this.logger.log(`영상 URL 직접 분석: ${url} (${platform})`);
    const geminiResult = await this.geminiService.analyzeVideoUrl(url);

    if (!geminiResult.title || !geminiResult.ingredients?.length) {
      throw new BadRequestException('영상에서 레시피를 추출할 수 없습니다.');
    }

    // 트랜잭션으로 Recipe + Ingredients + Steps 일괄 생성
    const recipe = await this.prisma.recipe.create({
      data: {
        videoUrl: url,
        videoPlatform: platform,
        title: geminiResult.title,
        difficulty: geminiResult.difficulty || null,
        cookTime: geminiResult.cookTime || null,
        servings: geminiResult.servings || null,
        geminiRawResponse: geminiResult as object,
        ingredients: {
          create: geminiResult.ingredients.map((ing, index) => ({
            name: ing.name,
            amount: ing.amount || null,
            unit: ing.unit || null,
            sortOrder: index + 1,
          })),
        },
        steps: {
          create: geminiResult.steps.map((step) => ({
            stepOrder: step.stepNumber,
            description: step.description,
          })),
        },
      },
    });

    this.logger.log(`레시피 생성 완료: ${recipe.id} - ${recipe.title}`);
    await this.createHistory(recipe.id, url, userId);

    return { id: recipe.id };
  };

  // 분석 히스토리 기록 (로그인 사용자만, 중복 방지)
  private createHistory = async (recipeId: string, videoUrl: string, userId: string | null) => {
    if (!userId) return;

    try {
      const existing = await this.prisma.analysisHistory.findFirst({
        where: { userId, recipeId },
        select: { id: true },
      });
      if (existing) return;

      await this.prisma.analysisHistory.create({
        data: { recipeId, videoUrl, userId },
      });
    } catch (error) {
      this.logger.warn(`히스토리 기록 실패: ${error}`);
    }
  };

  // 레시피 상세 조회
  findById = async (id: string) => {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: { orderBy: { sortOrder: 'asc' } },
        steps: { orderBy: { stepOrder: 'asc' } },
      },
    });

    if (!recipe) {
      throw new NotFoundException('레시피를 찾을 수 없습니다.');
    }

    return recipe;
  };
}
