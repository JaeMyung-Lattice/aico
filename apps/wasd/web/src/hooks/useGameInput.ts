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

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = CODE_TO_KEY[e.code]
      if (!key) return
      if (!myKeysRef.current.has(key)) return

      e.preventDefault()

      // 클라이언트 예측: 즉시 방향 + 이동 상태 반영
      const state = useGameStore.getState()
      if (state.gameState) {
        state.setGameState({
          ...state.gameState,
          direction: KEY_TO_DIRECTION[key],
          moving: true,
        })
      }

      socket.emit(SocketEvents.INPUT, { key })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gamePhase])
}
