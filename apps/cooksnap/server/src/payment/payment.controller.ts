import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SubscribeDto } from './dto/subscribe.dto';
import type { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('subscribe')
  subscribe(@Req() req: AuthenticatedRequest, @Body() dto: SubscribeDto) {
    return this.paymentService.subscribe(req.user.id, dto.billingKey);
  }

  @Post('cancel')
  cancel(@Req() req: AuthenticatedRequest) {
    return this.paymentService.cancelSubscription(req.user.id);
  }

  @Get('status')
  getStatus(@Req() req: AuthenticatedRequest) {
    return this.paymentService.getStatus(req.user.id);
  }
}
