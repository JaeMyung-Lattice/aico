import { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './InviteCode.module.scss'

const cx = classNames.bind(styles)

interface InviteCodeProps {
  code: string
}

const InviteCode = ({ code }: InviteCodeProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API not available
    }
  }

  return (
    <div className={cx('inviteCode')}>
      <span className={cx('label')}>초대 코드</span>
      <div className={cx('codeWrapper')}>
        <span className={cx('code')}>{code}</span>
        <button className={cx('copyButton')} onClick={handleCopy}>
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>
  )
}

export default InviteCode
