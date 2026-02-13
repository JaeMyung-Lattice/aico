import type { BattleResult, Equipment } from '@monster-factory/shared'
import styles from './BattleResult.module.scss'

interface BattleResultModalProps {
  result: BattleResult & { equipment?: Equipment | null }
  onClose: () => void
}

export const BattleResultModal = ({ result, onClose }: BattleResultModalProps) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={result.winner === 'player' ? styles.win : styles.lose}>
        {result.winner === 'player' ? '승리!' : '패배...'}
      </div>
      {result.goldReward > 0 && (
        <p className={styles.gold}>+{result.goldReward} Gold</p>
      )}
      {result.equipment && (
        <div className={styles.drop}>
          <span className={styles.dropLabel}>드롭:</span>
          <span className={styles.dropName}>{result.equipment.name}</span>
          <span className={styles.dropStat}>
            {result.equipment.statType.toUpperCase()} +{result.equipment.statValue}
          </span>
        </div>
      )}
      <button className={styles.closeBtn} onClick={onClose}>
        확인
      </button>
    </div>
  </div>
)
