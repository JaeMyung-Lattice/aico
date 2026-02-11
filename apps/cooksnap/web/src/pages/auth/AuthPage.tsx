import { useState } from 'react'
import classnames from 'classnames/bind'
import { useAuthStore } from '@/stores/useAuthStore'
import { Loading } from '@repo/ui'
import styles from './AuthPage.module.scss'

const cx = classnames.bind(styles)

const Auth = () => {
  const { signInWithGoogle } = useAuthStore()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleGoogleLogin = async () => {
    setIsSigningIn(true)
    await signInWithGoogle()
  }

  return (
    <div className={cx('auth')}>
      <Loading overlay loading={isSigningIn} message="로그인 중..." />
      <div className={cx('card')}>
        <h1 className={cx('title')}>로그인</h1>
        <p className={cx('subtitle')}>로그인하고 레시피 분석을 시작하세요</p>

        <div className={cx('buttons')}>
          <button
            className={cx('socialButton', 'googleButton')}
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
          >
            Google로 시작하기
          </button>
        </div>

        <div className={cx('freeNotice')}>
          간편하게 로그인하고 무제한 레시피 분석을 이용하세요
        </div>
      </div>
    </div>
  )
}

export default Auth
