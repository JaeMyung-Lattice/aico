import classNames from 'classnames/bind'
import type { Key } from '@wasd/shared'
import styles from './KeyIndicator.module.scss'

const cx = classNames.bind(styles)

interface KeyIndicatorProps {
  myKeys: Key[]
}

const KeyIndicator = ({ myKeys }: KeyIndicatorProps) => {
  const myKeysSet = new Set(myKeys)

  return (
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('key', { active: myKeysSet.has('w') })}>W</div>
      </div>
      <div className={cx('row')}>
        {(['a', 's', 'd'] as Key[]).map((key) => (
          <div key={key} className={cx('key', { active: myKeysSet.has(key) })}>
            {key.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyIndicator
