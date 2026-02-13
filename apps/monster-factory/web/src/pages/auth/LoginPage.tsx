import { useAuthStore } from '@/stores/useAuthStore'
import styles from './LoginPage.module.scss'

export const LoginPage = () => {
  const { signInWithGoogle, signInWithKakao } = useAuthStore()

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h1 className={styles.title}>Monster Factory</h1>
        <p className={styles.subtitle}>실력으로 키우는 몬스터 육성 게임</p>
      </div>
      <div className={styles.buttons}>
        <button className={styles.googleBtn} onClick={signInWithGoogle}>
          Google로 시작하기
        </button>
        <button className={styles.kakaoBtn} onClick={signInWithKakao}>
          Kakao로 시작하기
        </button>
      </div>
    </div>
  )
}
