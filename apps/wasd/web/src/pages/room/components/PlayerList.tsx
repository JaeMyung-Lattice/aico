import classNames from 'classnames/bind'
import type { Player } from '@wasd/shared'
import styles from './PlayerList.module.scss'

const cx = classNames.bind(styles)

interface PlayerListProps {
  players: Player[]
}

const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <div className={cx('playerList')}>
      <h2 className={cx('heading')}>참가자 ({players.length}/4)</h2>
      <ul className={cx('list')}>
        {players.map((player) => (
          <li key={player.id} className={cx('player')}>
            <span className={cx('nickname')}>{player.nickname}</span>
            {player.isHost && <span className={cx('hostBadge')}>호스트</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PlayerList
