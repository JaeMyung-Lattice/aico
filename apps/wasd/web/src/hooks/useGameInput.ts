import { useEffect, useRef } from 'react'
import type { Key, Direction } from '@wasd/shared'
import { SocketEvents } from '@wasd/shared'
import { socket } from '@/lib/socket'
import { useGameStore } from '@/stores/useGameStore'

const CODE_TO_KEY: Record<string, Key> = {
  KeyW: 'w',
  KeyA: 'a',
  KeyS: 's',
  KeyD: 'd',
}

const KEY_TO_DIRECTION: Record<Key, Direction> = {
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
}

export const useGameInput = () => {
  const myKeys = useGameStore((s) => s.myKeys)
  const gamePhase = useGameStore((s) => s.gamePhase)
  const myKeysRef = useRef(new Set<Key>(myKeys))
  myKeysRef.current = new Set<Key>(myKeys)

  useEffect(() => {
    if (gamePhase !== 'playing') return

    const emitKey = (key: Key) => {
      useGameStore.getState().applyPrediction(KEY_TO_DIRECTION[key])
      socket.emit(SocketEvents.INPUT, { key })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = CODE_TO_KEY[e.code]
      if (!key) return
      if (!myKeysRef.current.has(key)) return

      e.preventDefault()
      emitKey(key)
    }

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const key = target.dataset.key as Key | undefined
      if (!key) return
      if (!myKeysRef.current.has(key)) return

      e.preventDefault()
      emitKey(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [gamePhase])
}
