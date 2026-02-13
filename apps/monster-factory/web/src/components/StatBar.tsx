import type { MonsterStats } from '@monster-factory/shared'
import styles from './StatBar.module.scss'

interface StatBarProps {
  stats: MonsterStats
}

const STAT_LABELS: Record<keyof MonsterStats, string> = {
  atk: 'ATK',
  def: 'DEF',
  hp: 'HP',
  agi: 'AGI',
  int: 'INT',
  rec: 'REC',
}

const STAT_COLORS: Record<keyof MonsterStats, string> = {
  atk: '#e94560',
  def: '#38bdf8',
  hp: '#4ade80',
  agi: '#fb923c',
  int: '#a78bfa',
  rec: '#f472b6',
}

export const StatBar = ({ stats }: StatBarProps) => {
  const maxStat = Math.max(...Object.values(stats), 30)

  return (
    <div className={styles.container}>
      {(Object.entries(stats) as [keyof MonsterStats, number][]).map(
        ([key, value]) => (
          <div key={key} className={styles.row}>
            <span className={styles.label}>{STAT_LABELS[key]}</span>
            <div className={styles.barBg}>
              <div
                className={styles.barFill}
                style={{
                  width: `${(value / maxStat) * 100}%`,
                  backgroundColor: STAT_COLORS[key],
                }}
              />
            </div>
            <span className={styles.value}>{value.toFixed(1)}</span>
          </div>
        ),
      )}
    </div>
  )
}
