import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import styles from './TutorialPage.module.scss'

const STEPS = [
  {
    title: '환영합니다!',
    desc: 'Monster Factory에 오신 걸 환영해요. 실력으로 몬스터를 키우는 게임입니다.',
  },
  {
    title: '몬스터 부화',
    desc: '알을 부화시키면 랜덤 속성과 성격의 몬스터가 탄생합니다. 6가지 속성과 6가지 성격이 있어요.',
  },
  {
    title: '미니게임으로 성장',
    desc: '미니게임을 클리어하면 등급(S~D)에 따라 스탯이 상승합니다. 실력이 곧 성장!',
  },
  {
    title: '솔로 던전',
    desc: '던전에서 적과 싸워 골드와 장비를 획득하세요. 속성 상성을 활용하면 유리합니다.',
  },
  {
    title: '준비 완료!',
    desc: '에너지는 하루 5회 충전됩니다. 지금 바로 시작해볼까요?',
  },
]

export const TutorialPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      try {
        await api.patch('/users/me/tutorial')
      } catch {
        // 실패해도 진행
      }
      navigate('/hatch')
    }
  }

  const handleSkip = async () => {
    try {
      await api.patch('/users/me/tutorial')
    } catch {
      // 실패해도 진행
    }
    navigate('/hatch')
  }

  const current = STEPS[step]!

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i <= step ? styles.active : ''}`}
          />
        ))}
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{current.title}</h2>
        <p className={styles.desc}>{current.desc}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.nextBtn} onClick={handleNext}>
          {step < STEPS.length - 1 ? '다음' : '시작하기'}
        </button>
        {step < STEPS.length - 1 && (
          <button className={styles.skipBtn} onClick={handleSkip}>
            건너뛰기
          </button>
        )}
      </div>
    </div>
  )
}
