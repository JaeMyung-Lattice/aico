import { useNavigate } from 'react-router-dom'
import { useDungeonStore } from '@/stores/useDungeonStore'
import { BattleResultModal } from '@/components/BattleResult'
import styles from './DungeonBattlePage.module.scss'

export const DungeonBattlePage = () => {
  const navigate = useNavigate()
  const { battleResult, clearResult } = useDungeonStore()

  if (!battleResult) {
    navigate('/dungeon')
    return null
  }

  const handleClose = () => {
    clearResult()
    navigate('/game')
  }

  return (
    <div className={styles.container}>
      <div className={styles.battleLog}>
        <h3 className={styles.title}>전투 기록</h3>
        <div className={styles.turns}>
          {battleResult.turns.slice(-10).map((turn, i) => (
            <div
              key={i}
              className={`${styles.turn} ${turn.attacker === 'player' ? styles.player : styles.enemy}`}
            >
              <span className={styles.turnNum}>T{turn.turn}</span>
              <span>{turn.attacker === 'player' ? '내 몬스터' : '적'}</span>
              <span className={styles.damage}>
                {turn.damage}dmg{turn.isCritical ? ' CRIT!' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
      <BattleResultModal result={battleResult} onClose={handleClose} />
    </div>
  )
}
