import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMonsterStore } from '@/stores/useMonsterStore'
import { useGameStore } from '@/stores/useGameStore'
import { StatBar } from '@/components/StatBar'
import { EnergyIndicator } from '@/components/EnergyIndicator'
import type { MinigameType } from '@monster-factory/shared'
import styles from './GamePage.module.scss'

const MINIGAMES: { type: MinigameType; label: string; stat: string }[] = [
  { type: 'TimingClick', label: '타이밍 클릭', stat: 'ATK' },
  { type: 'PatternMemory', label: '패턴 기억', stat: 'DEF' },
  { type: 'MashChallenge', label: '연타 챌린지', stat: 'HP' },
]

export const GamePage = () => {
  const navigate = useNavigate()
  const { monster } = useMonsterStore()
  const { energy, fetchEnergy, setCurrentMinigame } = useGameStore()

  useEffect(() => {
    fetchEnergy()
  }, [fetchEnergy])

  if (!monster) {
    navigate('/hatch')
    return null
  }

  const stats = {
    atk: monster.stats.atk,
    def: monster.stats.def,
    hp: monster.stats.hp,
    agi: monster.stats.agi,
    int: monster.stats.int,
    rec: monster.stats.rec,
  }

  const handleMinigame = (type: MinigameType) => {
    if (energy && energy.remaining < 1) return
    setCurrentMinigame(type)
    navigate('/minigame')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.name}>
          {monster.name ?? '이름 없음'}{' '}
          <span className={styles.element}>{monster.element}</span>
        </h2>
        <span className={styles.stage}>{monster.growthStage}</span>
      </div>

      {energy && <EnergyIndicator energy={energy} />}

      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>스탯</h3>
        <StatBar stats={stats} />
      </div>

      <div className={styles.minigameSection}>
        <h3 className={styles.sectionTitle}>미니게임</h3>
        <div className={styles.minigameGrid}>
          {MINIGAMES.map(({ type, label, stat }) => (
            <button
              key={type}
              className={styles.minigameBtn}
              onClick={() => handleMinigame(type)}
              disabled={energy !== null && energy.remaining < 1}
            >
              <span className={styles.minigameLabel}>{label}</span>
              <span className={styles.minigameStat}>{stat}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.dungeonSection}>
        <button
          className={styles.dungeonBtn}
          onClick={() => navigate('/dungeon')}
        >
          솔로 던전
        </button>
      </div>
    </div>
  )
}
