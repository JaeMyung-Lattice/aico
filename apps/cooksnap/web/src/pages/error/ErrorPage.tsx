import { useRouteError, Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './ErrorPage.module.scss'

const cx = classNames.bind(styles)

const ErrorPage = () => {
  const error = useRouteError()

  const errorMessage =
    error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>문제가 발생했습니다</h1>
      <p className={cx('message')}>{errorMessage}</p>
      <Link to="/" className={cx('homeButton')}>
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default ErrorPage
