import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users/me')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('recipes')
  getSavedRecipes(@Req() req: any) {
    return this.usersService.getSavedRecipes(req.user.id);
  }

  @Get('recipes/:recipeId/saved')
  isRecipeSaved(@Req() req: any, @Param('recipeId') recipeId: string) {
    return this.usersService.isRecipeSaved(req.user.id, recipeId);
  }

  @Post('recipes/:recipeId/save')
  saveRecipe(@Req() req: any, @Param('recipeId') recipeId: string) {
    return this.usersService.saveRecipe(req.user.id, recipeId);
  }

  @Delete('recipes/:recipeId/save')
  unsaveRecipe(@Req() req: any, @Param('recipeId') recipeId: string) {
    return this.usersService.unsaveRecipe(req.user.id, recipeId);
  }

  @Get('history')
  getHistory(@Req() req: any) {
    return this.usersService.getHistory(req.user.id);
  }
}
