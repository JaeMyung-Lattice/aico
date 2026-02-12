import { useNavigate, Navigate } from 'react-router-dom'
import classNames from 'classnames/bind'
import { useGameStore } from '@/stores/useGameStore'
import styles from './ResultPage.module.scss'

const cx = classNames.bind(styles)

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const ResultPage = () => {
  const navigate = useNavigate()
  const gameResult = useGameStore((s) => s.gameResult)

  if (!gameResult) {
    return <Navigate to="/" replace />
  }

  const handleHome = () => {
    useGameStore.getState().reset()
    navigate('/')
  }

  return (
    <div className={cx('container')}>
      <div className={cx('card')}>
        <h1 className={cx('title')}>Game Clear!</h1>
        <p className={cx('subtitle')}>모든 스테이지를 클리어했습니다</p>

        <div className={cx('stats')}>
          <div className={cx('stat')}>
            <span className={cx('statLabel')}>소요 시간</span>
            <span className={cx('statValue')}>{formatTime(gameResult.elapsedTime)}</span>
          </div>
          <div className={cx('stat')}>
            <span className={cx('statLabel')}>총 사망</span>
            <span className={cx('statValue', { danger: gameResult.deaths > 0 })}>
              {gameResult.deaths}회
            </span>
          </div>
        </div>

        <button className={cx('homeButton')} onClick={handleHome}>
          메인으로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default ResultPage
