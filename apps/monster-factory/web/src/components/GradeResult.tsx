import type { GradeResult as GradeResultType } from '@monster-factory/shared'
import styles from './GradeResult.module.scss'

interface GradeResultProps {
  result: GradeResultType
  onClose: () => void
}

const GRADE_COLORS: Record<string, string> = {
  S: '#ffd700',
  A: '#e94560',
  B: '#a78bfa',
  C: '#38bdf8',
  D: '#94a3b8',
}

export const GradeResult = ({ result, onClose }: GradeResultProps) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div
        className={styles.grade}
        style={{ color: GRADE_COLORS[result.grade] }}
      >
        {result.grade}
      </div>
      <p className={styles.score}>Score: {result.score}</p>
      <p className={styles.stat}>
        {result.statType.toUpperCase()} +{result.statIncrease.toFixed(1)}
      </p>
      <button className={styles.closeBtn} onClick={onClose}>
        확인
      </button>
    </div>
  </div>
)
