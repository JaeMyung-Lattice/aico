import { useEffect, useRef } from 'react'
import type { Key } from '@wasd/shared'
import { SocketEvents } from '@wasd/shared'
import { socket } from '@/lib/socket'
import { useGameStore } from '@/stores/useGameStore'

const VALID_KEYS = new Set<string>(['w', 'a', 's', 'd'])

export const useGameInput = () => {
  const myKeys = useGameStore((s) => s.myKeys)
  const gamePhase = useGameStore((s) => s.gamePhase)
  const myKeysRef = useRef(new Set<Key>(myKeys))
  myKeysRef.current = new Set<Key>(myKeys)

  useEffect(() => {
    if (gamePhase !== 'playing') return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!VALID_KEYS.has(key)) return
      if (!myKeysRef.current.has(key as Key)) return

      e.preventDefault()
      socket.emit(SocketEvents.INPUT, { key })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gamePhase])
}
