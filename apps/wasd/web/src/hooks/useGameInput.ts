import { useEffect, useRef } from 'react'
import type { Key } from '@wasd/shared'
import { SocketEvents } from '@wasd/shared'
import { socket } from '@/lib/socket'
import { useGameStore } from '@/stores/useGameStore'

const CODE_TO_KEY: Record<string, Key> = {
  KeyW: 'w',
  KeyA: 'a',
  KeyS: 's',
  KeyD: 'd',
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
      socket.emit(SocketEvents.INPUT, { key })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gamePhase])
}
