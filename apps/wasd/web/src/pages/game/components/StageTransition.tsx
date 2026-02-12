import classNames from 'classnames/bind'
import styles from './StageTransition.module.scss'

const cx = classNames.bind(styles)

interface StageTransitionProps {
  stage: number
}

const StageTransition = ({ stage }: StageTransitionProps) => (
  <div className={cx('overlay')}>
    <div className={cx('content')}>
      <h2 className={cx('title')}>Stage {stage} Clear!</h2>
      <p className={cx('subtitle')}>다음 스테이지 준비 중...</p>
      <div className={cx('dots')}>
        <span className={cx('dot')} />
        <span className={cx('dot')} />
        <span className={cx('dot')} />
      </div>
    </div>
  </div>
)

export default StageTransition
