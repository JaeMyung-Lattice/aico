import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PortoneModule } from '../portone/portone.module';

@Module({
  imports: [PortoneModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
