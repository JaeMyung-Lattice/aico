import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { PremiumService } from '../premium/premium.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly premiumService: PremiumService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    return {
      ...req.user,
      isPremium: this.premiumService.isPremiumActive(req.user),
    };
  }
}
