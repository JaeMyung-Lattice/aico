import { useState } from 'react'
import classnames from 'classnames/bind'
import { useAuthStore } from '@/stores/useAuthStore'
import { isPortoneConfigured, requestBillingKey } from '@/lib/portone'
import api from '@/lib/api'
import styles from './PremiumModal.module.scss'

const cx = classnames.bind(styles)

interface PremiumModalProps {
  onClose: () => void
}

const PremiumModal = ({ onClose }: PremiumModalProps) => {
  const { user, initialize } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const portoneReady = isPortoneConfigured()

  const handleSubscribe = async () => {
    if (!user) return

    setIsProcessing(true)
    setError(null)

    try {
      const billingKey = await requestBillingKey(user.id, user.email)
      await api.post('/payments/subscribe', { billingKey })
      await initialize()
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : '결제에 실패했습니다.'
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={cx('overlay')} onClick={onClose}>
      <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
        <button className={cx('closeButton')} onClick={onClose}>
          &times;
        </button>

        <h2 className={cx('title')}>Premium 업그레이드</h2>

        <div className={cx('benefits')}>
          <div className={cx('benefit')}>
            <div className={cx('benefitIcon')}>∞</div>
            <span className={cx('benefitText')}>무제한 레시피 분석</span>
          </div>
          <div className={cx('benefit')}>
            <div className={cx('benefitIcon')}>♥</div>
            <span className={cx('benefitText')}>레시피 저장 기능</span>
          </div>
          <div className={cx('benefit')}>
            <div className={cx('benefitIcon')}>⚡</div>
            <span className={cx('benefitText')}>쿠팡 원클릭 주문</span>
          </div>
        </div>

        <div className={cx('pricing')}>
          <span className={cx('price')}>월 3,900원</span>
          <span className={cx('priceNote')}>커피 한 잔 가격으로 무제한</span>
        </div>

        {error && <p className={cx('error')}>{error}</p>}

        <button
          className={cx('subscribeButton')}
          disabled={!portoneReady || isProcessing}
          onClick={handleSubscribe}
        >
          {isProcessing
            ? '결제 진행 중...'
            : portoneReady
              ? '구독하기'
              : '구독하기 (준비중)'}
        </button>

        <p className={cx('disclaimer')}>
          {portoneReady
            ? '구독은 월 단위 자동 갱신되며, 언제든지 해지할 수 있습니다.'
            : '결제 기능은 곧 추가됩니다.'}
        </p>
      </div>
    </div>
  )
}

export default PremiumModal
