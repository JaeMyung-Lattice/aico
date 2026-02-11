import {
  Injectable,
  Logger,
  ConflictException,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PortoneService } from '../portone/portone.service';
import { randomUUID } from 'crypto';

const SUBSCRIPTION_PRICE = 3900;
const SUBSCRIPTION_DAYS = 30;

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly portoneService: PortoneService,
  ) {}

  subscribe = async (userId: string, billingKey: string) => {
    if (!this.portoneService.isAvailable()) {
      throw new ServiceUnavailableException('결제 서비스가 아직 설정되지 않았습니다.');
    }

    // 기존 ACTIVE 구독 확인
    const existing = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (existing) {
      throw new ConflictException('이미 활성 구독이 있습니다.');
    }

    const now = new Date();
    const periodEnd = new Date(now.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);

    // Subscription 생성
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        billingKey,
        status: 'ACTIVE',
        currentPeriodEnd: periodEnd,
      },
    });

    // 포트원 결제
    const paymentId = `cooksnap_${randomUUID()}`;

    try {
      await this.portoneService.chargeBillingKey({
        billingKey,
        paymentId,
        amount: SUBSCRIPTION_PRICE,
        orderName: 'CookSnap Premium 구독',
      });

      // 결제 성공 → Payment 기록 + 프리미엄 활성화
      await this.prisma.$transaction([
        this.prisma.payment.create({
          data: {
            userId,
            subscriptionId: subscription.id,
            amount: SUBSCRIPTION_PRICE,
            status: 'PAID',
            portonePaymentId: paymentId,
            paidAt: new Date(),
          },
        }),
        this.prisma.user.update({
          where: { id: userId },
          data: { isPremium: true, premiumExpiresAt: periodEnd },
        }),
      ]);

      return { success: true, currentPeriodEnd: periodEnd };
    } catch (error) {
      this.logger.error(`결제 실패: ${error}`);

      // 결제 실패 → Subscription 만료 + Payment 기록
      await this.prisma.$transaction([
        this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' },
        }),
        this.prisma.payment.create({
          data: {
            userId,
            subscriptionId: subscription.id,
            amount: SUBSCRIPTION_PRICE,
            status: 'FAILED',
            portonePaymentId: paymentId,
            failReason: error instanceof Error ? error.message : '결제 실패',
          },
        }),
      ]);

      throw new ServiceUnavailableException('결제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  cancelSubscription = async (userId: string) => {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!subscription) {
      throw new NotFoundException('활성 구독이 없습니다.');
    }

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // isPremium은 유지, premiumExpiresAt까지 사용 가능
    return {
      cancelledAt: new Date(),
      premiumUntil: subscription.currentPeriodEnd,
    };
  };

  getStatus = async (userId: string) => {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'CANCELLED'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return {
        hasSubscription: false,
        status: null,
        currentPeriodEnd: null,
      };
    }

    return {
      hasSubscription: true,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
    };
  };
}
