import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChargeBillingKeyParams {
  billingKey: string;
  paymentId: string;
  amount: number;
  orderName: string;
}

interface PortonePaymentResponse {
  status: string;
  id: string;
}

@Injectable()
export class PortoneService {
  private readonly logger = new Logger(PortoneService.name);
  private readonly apiSecret: string | undefined;
  private readonly storeId: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiSecret = this.configService.get<string>('portone.apiSecret');
    this.storeId = this.configService.get<string>('portone.storeId');
  }

  isAvailable = (): boolean => {
    return !!(this.apiSecret && this.storeId);
  };

  chargeBillingKey = async (params: ChargeBillingKeyParams): Promise<PortonePaymentResponse> => {
    const { billingKey, paymentId, amount, orderName } = params;

    const response = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/billing-key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PortOne ${this.apiSecret}`,
        },
        body: JSON.stringify({
          storeId: this.storeId,
          billingKey,
          orderName,
          amount: { total: amount },
          currency: 'KRW',
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`포트원 결제 실패: ${response.status} ${errorBody}`);
      throw new Error(`포트원 결제 실패: ${response.status}`);
    }

    return response.json();
  };

  cancelPayment = async (paymentId: string, reason: string): Promise<void> => {
    const response = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PortOne ${this.apiSecret}`,
        },
        body: JSON.stringify({ reason }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`포트원 결제 취소 실패: ${response.status} ${errorBody}`);
      throw new Error(`포트원 결제 취소 실패: ${response.status}`);
    }
  };
}
