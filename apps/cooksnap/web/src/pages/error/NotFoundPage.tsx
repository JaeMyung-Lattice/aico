import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './NotFoundPage.module.scss'

const cx = classNames.bind(styles)

const NotFoundPage = () => {
  return (
    <div className={cx('container')}>
      <h1 className={cx('code')}>404</h1>
      <p className={cx('message')}>페이지를 찾을 수 없습니다</p>
      <Link to="/" className={cx('homeButton')}>
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFoundPage
