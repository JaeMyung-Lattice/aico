import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { KamisService } from '../kamis/kamis.service';
import { CoupangService } from '../coupang/coupang.service';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { AnalyzeRecipeDto } from './dto/analyze-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly kamisService: KamisService,
    private readonly coupangService: CoupangService,
  ) {}

  @Post('analyze')
  @UseGuards(OptionalAuthGuard)
  analyze(@Body() dto: AnalyzeRecipeDto, @Req() req: any) {
    return this.recipesService.analyze(dto.url, req.user?.id || null);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.recipesService.findById(id);
  }

  @Get(':id/prices')
  getPrices(@Param('id') id: string) {
    return this.kamisService.getRecipePrices(id);
  }

  @Get(':id/purchase-links')
  getPurchaseLinks(@Param('id') id: string) {
    return this.coupangService.getPurchaseLinks(id);
  }
}
