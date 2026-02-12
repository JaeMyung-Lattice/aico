import classNames from 'classnames/bind'
import type { GameState } from '@wasd/shared'
import styles from './GameHUD.module.scss'

const cx = classNames.bind(styles)

interface GameHUDProps {
  gameState: GameState
}

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const GameHUD = ({ gameState }: GameHUDProps) => (
  <div className={cx('hud')}>
    <div className={cx('item')}>
      <span className={cx('label')}>Stage</span>
      <span className={cx('value')}>
        {gameState.stage}/{gameState.totalStages}
      </span>
    </div>
    <div className={cx('item')}>
      <span className={cx('label')}>Coins</span>
      <span className={cx('value')}>
        {gameState.coins}/{gameState.totalCoins}
      </span>
    </div>
    <div className={cx('item')}>
      <span className={cx('label')}>Deaths</span>
      <span className={cx('value', { danger: gameState.deaths > 0 })}>
        {gameState.deaths}
      </span>
    </div>
    <div className={cx('item')}>
      <span className={cx('label')}>Time</span>
      <span className={cx('value')}>{formatTime(gameState.elapsedTime)}</span>
    </div>
  </div>
)

export default GameHUD
