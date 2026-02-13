import { Header } from './Header'
import { BottomNav } from './BottomNav'
import styles from './Layout.module.scss'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <div className={styles.layout}>
    <Header />
    <main className={styles.main}>{children}</main>
    <BottomNav />
  </div>
)
