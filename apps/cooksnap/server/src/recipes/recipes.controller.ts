import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { KamisService } from '../kamis/kamis.service';
import { CoupangService } from '../coupang/coupang.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AnalyzeRecipeDto } from './dto/analyze-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly kamisService: KamisService,
    private readonly coupangService: CoupangService,
  ) {}

  @Post('analyze')
  @UseGuards(AuthGuard)
  analyze(@Body() dto: AnalyzeRecipeDto, @Req() req: any) {
    return this.recipesService.analyze(dto.url, req.user.id);
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
