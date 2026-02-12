import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind'
import { socket } from '@/lib/socket'
import { useGameStore } from '@/stores/useGameStore'
import { SocketEvents } from '@wasd/shared'
import type { Room } from '@wasd/shared'
import { initAudio } from '@/game/sound'
import styles from './HomePage.module.scss'

const cx = classNames.bind(styles)

const HomePage = () => {
  const navigate = useNavigate()
  const { nickname, setNickname } = useGameStore()
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const handleCreateRoom = () => {
    initAudio()
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }

    socket.off(SocketEvents.ROOM_UPDATED)
    socket.off(SocketEvents.ERROR)
    socket.emit(SocketEvents.CREATE_ROOM, { nickname: nickname.trim() })

    socket.once(SocketEvents.ROOM_UPDATED, (room: Room) => {
      socket.off(SocketEvents.ERROR)
      useGameStore.getState().updateRoom(room)
      navigate(`/room/${room.code}`)
    })
  }

  const handleJoinRoom = () => {
    initAudio()
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }
    if (!inviteCode.trim()) {
      setError('초대 코드를 입력해주세요.')
      return
    }

    socket.off(SocketEvents.ROOM_UPDATED)
    socket.off(SocketEvents.ERROR)
    socket.emit(SocketEvents.JOIN_ROOM, {
      code: inviteCode.trim().toUpperCase(),
      nickname: nickname.trim(),
    })

    socket.once(SocketEvents.ROOM_UPDATED, (room: Room) => {
      socket.off(SocketEvents.ERROR)
      useGameStore.getState().updateRoom(room)
      navigate(`/room/${room.code}`)
    })

    socket.once(SocketEvents.ERROR, ({ message }: { message: string }) => {
      socket.off(SocketEvents.ROOM_UPDATED)
      setError(message)
    })
  }

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>WASD</h1>
      <p className={cx('subtitle')}>협동 파티 게임</p>

      <div className={cx('form')}>
        <input
          className={cx('input')}
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            setError('')
          }}
          maxLength={10}
        />

        <button className={cx('createButton')} onClick={handleCreateRoom}>
          방 만들기
        </button>

        <div className={cx('divider')}>또는</div>

        <input
          className={cx('input')}
          type="text"
          placeholder="초대 코드"
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value.toUpperCase())
            setError('')
          }}
          maxLength={6}
        />

        <button className={cx('joinButton')} onClick={handleJoinRoom}>
          참가하기
        </button>

        {error && <p className={cx('error')}>{error}</p>}
      </div>
    </div>
  )
}

export default HomePage
