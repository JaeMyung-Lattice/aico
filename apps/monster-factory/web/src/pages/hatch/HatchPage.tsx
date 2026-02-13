import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMonsterStore } from '@/stores/useMonsterStore'
import type { Monster } from '@monster-factory/shared'
import styles from './HatchPage.module.scss'

export const HatchPage = () => {
  const { hatchMonster } = useMonsterStore()
  const navigate = useNavigate()
  const [hatching, setHatching] = useState(false)
  const [result, setResult] = useState<Monster | null>(null)

  const handleHatch = async () => {
    setHatching(true)
    try {
      const monster = await hatchMonster()
      // 부화 연출 대기
      setTimeout(() => {
        setResult(monster)
      }, 2000)
    } catch {
      setHatching(false)
    }
  }

  const handleContinue = () => {
    navigate('/game')
  }

  if (result) {
    return (
      <div className={styles.container}>
        <div className={styles.result}>
          <h2 className={styles.resultTitle}>몬스터 탄생!</h2>
          <div className={styles.monsterInfo}>
            <span className={styles.element}>{result.element}</span>
            <span className={styles.personality}>{result.personality}</span>
          </div>
          <button className={styles.continueBtn} onClick={handleContinue}>
            시작하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.eggWrapper}>
        <div className={`${styles.egg} ${hatching ? styles.hatching : ''}`} />
      </div>
      {!hatching && (
        <button className={styles.hatchBtn} onClick={handleHatch}>
          알 부화하기
        </button>
      )}
      {hatching && <p className={styles.hatchingText}>부화 중...</p>}
    </div>
  )
}
