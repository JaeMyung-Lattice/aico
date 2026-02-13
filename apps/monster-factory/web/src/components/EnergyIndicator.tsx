import { useEffect, useState } from 'react'
import type { EnergyState } from '@monster-factory/shared'
import styles from './EnergyIndicator.module.scss'

interface EnergyIndicatorProps {
  energy: EnergyState
}

export const EnergyIndicator = ({ energy }: EnergyIndicatorProps) => {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const reset = new Date(energy.nextResetAt).getTime()
      const diff = Math.max(0, reset - now)
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      setCountdown(`${hours}h ${minutes}m`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [energy.nextResetAt])

  return (
    <div className={styles.container}>
      <div className={styles.icons}>
        {Array.from({ length: energy.max }).map((_, i) => (
          <span
            key={i}
            className={`${styles.icon} ${i < energy.remaining ? styles.active : styles.empty}`}
          >
            ⚡
          </span>
        ))}
      </div>
      <span className={styles.reset}>리셋: {countdown}</span>
    </div>
  )
}
