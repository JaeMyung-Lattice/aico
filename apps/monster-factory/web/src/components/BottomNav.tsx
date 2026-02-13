import { useLocation, useNavigate } from 'react-router-dom'
import styles from './BottomNav.module.scss'

const TABS = [
  { path: '/game', label: '홈' },
  { path: '/minigame', label: '훈련' },
  { path: '/dungeon', label: '던전' },
  { path: '/inventory', label: '장비' },
]

export const BottomNav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      {TABS.map(({ path, label }) => (
        <button
          key={path}
          className={`${styles.tab} ${pathname === path ? styles.active : ''}`}
          onClick={() => navigate(path)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
