import classnames from 'classnames/bind'
import styles from './PremiumModal.module.scss'

const cx = classnames.bind(styles)

interface PremiumModalProps {
  onClose: () => void
}

const PremiumModal = ({ onClose }: PremiumModalProps) => {
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

        <button className={cx('subscribeButton')} disabled>
          구독하기 (준비중)
        </button>

        <p className={cx('disclaimer')}>
          결제 기능은 곧 추가됩니다.
        </p>
      </div>
    </div>
  )
}

export default PremiumModal
