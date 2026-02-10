import { useNavigate } from 'react-router-dom'
import classnames from 'classnames/bind'
import { useAuthStore } from '@/stores/useAuthStore'
import styles from './Header.module.scss'

const cx = classnames.bind(styles)

const Header = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleLoginClick = () => {
    navigate('/auth')
  }

  const handleProfileClick = () => {
    navigate('/mypage')
  }

  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <div className={cx('logo')} onClick={handleLogoClick}>
          Cook<span>Snap</span>
        </div>
        <nav className={cx('nav')}>
          {user ? (
            <button className={cx('profileButton')} onClick={handleProfileClick}>
              {user.nickname?.[0] || user.email[0]}
            </button>
          ) : (
            <button className={cx('loginButton')} onClick={handleLoginClick}>
              로그인
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
