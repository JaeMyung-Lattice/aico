import type { Equipment } from '@monster-factory/shared'
import styles from './EquipmentCard.module.scss'

interface EquipmentCardProps {
  item: Equipment
  onAction: () => void
  actionLabel: string
}

const GRADE_COLORS: Record<string, string> = {
  Normal: '#94a3b8',
  Uncommon: '#4ade80',
  Rare: '#a78bfa',
}

export const EquipmentCard = ({ item, onAction, actionLabel }: EquipmentCardProps) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <span
        className={styles.name}
        style={{ color: GRADE_COLORS[item.grade] }}
      >
        {item.name}
      </span>
      <span className={styles.grade}>{item.grade}</span>
    </div>
    <div className={styles.info}>
      <span className={styles.slot}>{item.slot}</span>
      <span className={styles.stat}>
        {item.statType.toUpperCase()} +{item.statValue}
      </span>
    </div>
    <button className={styles.actionBtn} onClick={onAction}>
      {actionLabel}
    </button>
  </div>
)
