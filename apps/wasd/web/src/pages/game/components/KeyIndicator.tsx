import classNames from 'classnames/bind'
import type { Key } from '@wasd/shared'
import styles from './KeyIndicator.module.scss'

const cx = classNames.bind(styles)

const ALL_KEYS: Key[] = ['w', 'a', 's', 'd']

interface KeyIndicatorProps {
  myKeys: Key[]
}

const KeyIndicator = ({ myKeys }: KeyIndicatorProps) => {
  const myKeysSet = new Set(myKeys)

  const renderKey = (key: Key) => {
    const isActive = myKeysSet.has(key)
    return (
      <div
        key={key}
        data-key={isActive ? key : undefined}
        className={cx('key', {
          active: isActive,
          disabled: !isActive,
        })}
      >
        {key.toUpperCase()}
      </div>
    )
  }

  return (
    <div className={cx('container')}>
      <div className={cx('row')}>
        {renderKey('w')}
      </div>
      <div className={cx('row')}>
        {ALL_KEYS.filter((k) => k !== 'w').map(renderKey)}
      </div>
    </div>
  )
}

export default KeyIndicator
