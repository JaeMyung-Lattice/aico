import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind'
import type { GameState, DeathEvent } from '@wasd/shared'
import { SocketEvents, STAGES } from '@wasd/shared'
import { socket } from '@/lib/socket'
import { useGameStore } from '@/stores/useGameStore'
import { useGameInput } from '@/hooks/useGameInput'
import { sound } from '@/game/sound'
import GameCanvas from './components/GameCanvas'
import GameHUD from './components/GameHUD'
import KeyIndicator from './components/KeyIndicator'
import DeathLog from './components/DeathLog'
import StageTransition from './components/StageTransition'
import styles from './GamePage.module.scss'

const cx = classNames.bind(styles)

const GamePage = () => {
  const navigate = useNavigate()
  const roomCode = useGameStore((s) => s.roomCode)
  const myKeys = useGameStore((s) => s.myKeys)
  const gameState = useGameStore((s) => s.gameState)
  const gamePhase = useGameStore((s) => s.gamePhase)
  const deathEvent = useGameStore((s) => s.deathEvent)
  const prevCoinsRef = useRef(0)

  const handleDismissDeathLog = useCallback(() => {
    useGameStore.getState().setDeathEvent(null)
  }, [])

  useGameInput()

  useEffect(() => {
    if (!roomCode) {
      navigate('/')
      return
    }

    const handleGameState = (state: GameState) => {
      const prevCoins = prevCoinsRef.current
      if (state.coins > prevCoins) {
        sound.coin()
      }
      prevCoinsRef.current = state.coins
      useGameStore.getState().setGameState(state)
    }

    const handleDeath = (event: DeathEvent) => {
      sound.death()
      useGameStore.getState().setDeathEvent(event)
    }

    const handleStageClear = () => {
      sound.stageClear()
      useGameStore.getState().setGamePhase('stage-clear')
    }

    const handleGameComplete = (data: { deaths: number; elapsedTime: number }) => {
      sound.gameComplete()
      useGameStore.getState().setGameResult(data)
    }

    socket.on(SocketEvents.GAME_STATE, handleGameState)
    socket.on(SocketEvents.DEATH, handleDeath)
    socket.on(SocketEvents.STAGE_CLEAR, handleStageClear)
    socket.on(SocketEvents.GAME_COMPLETE, handleGameComplete)

    return () => {
      socket.off(SocketEvents.GAME_STATE, handleGameState)
      socket.off(SocketEvents.DEATH, handleDeath)
      socket.off(SocketEvents.STAGE_CLEAR, handleStageClear)
      socket.off(SocketEvents.GAME_COMPLETE, handleGameComplete)
    }
  }, [navigate, roomCode])

  useEffect(() => {
    if (gamePhase === 'complete' && roomCode) {
      navigate(`/result/${roomCode}`)
    }
  }, [gamePhase, roomCode, navigate])

  if (!roomCode || !gameState) {
    return (
      <div className={cx('container')}>
        <div className={cx('loading')}>게임 로딩 중...</div>
      </div>
    )
  }

  const tileMap = STAGES[gameState.stage - 1]
  if (!tileMap) return null

  return (
    <div className={cx('container')}>
      <GameHUD gameState={gameState} />
      <div className={cx('gameArea')}>
        <GameCanvas gameState={gameState} tileMap={tileMap} />
      </div>
      <KeyIndicator myKeys={myKeys} />

      {deathEvent && (
        <DeathLog deathEvent={deathEvent} onDismiss={handleDismissDeathLog} />
      )}

      {gamePhase === 'stage-clear' && <StageTransition stage={gameState.stage} />}
    </div>
  )
}

export default GamePage
