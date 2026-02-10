import classnames from 'classnames/bind'
import { useAuthStore } from '@/stores/useAuthStore'
import styles from './AuthPage.module.scss'

const cx = classnames.bind(styles)

const Auth = () => {
  const { signInWithKakao, signInWithGoogle } = useAuthStore()

  return (
    <div className={cx('auth')}>
      <div className={cx('card')}>
        <h1 className={cx('title')}>로그인</h1>
        <p className={cx('subtitle')}>레시피를 저장하고 히스토리를 관리하세요</p>

        <div className={cx('buttons')}>
          <button
            className={cx('socialButton', 'kakaoButton')}
            onClick={signInWithKakao}
          >
            카카오로 시작하기
          </button>
          <button
            className={cx('socialButton', 'googleButton')}
            onClick={signInWithGoogle}
          >
            Google로 시작하기
          </button>
        </div>

        <div className={cx('freeNotice')}>
          로그인 없이도 하루 3회 무료 분석이 가능합니다
        </div>
      </div>
    </div>
  )
}

export default Auth
