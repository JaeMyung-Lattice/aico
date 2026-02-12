import { useRef, useEffect } from 'react'
import type { GameState, TileMap } from '@wasd/shared'
import { useCanvas } from '@/hooks/useCanvas'
import { renderFrame } from '@/game/renderer'
import {
  createInterpolationState,
  updateInterpolationState,
  getInterpolatedPosition,
  shouldResetInterpolation,
} from '@/game/interpolation'

interface GameCanvasProps {
  gameState: GameState
  tileMap: TileMap
}

const GameCanvas = ({ gameState, tileMap }: GameCanvasProps) => {
  const interpRef = useRef(createInterpolationState(gameState.position))
  const prevStateRef = useRef<GameState | null>(null)
  const collectedSetRef = useRef(new Set(gameState.collectedCoins))
  const gameStateRef = useRef(gameState)
  const tileMapRef = useRef(tileMap)

  useEffect(() => {
    if (shouldResetInterpolation(prevStateRef.current, gameState)) {
      interpRef.current = createInterpolationState(gameState.position)
    } else {
      interpRef.current = updateInterpolationState(interpRef.current, gameState.position)
    }
    prevStateRef.current = gameState
    collectedSetRef.current = new Set(gameState.collectedCoins)
    gameStateRef.current = gameState
    tileMapRef.current = tileMap
  }, [gameState, tileMap])

  const canvasRef = useCanvas((ctx) => {
    const state = gameStateRef.current
    const renderPosition = getInterpolatedPosition(interpRef.current, state.direction, state.moving)
    renderFrame(ctx, tileMapRef.current, state, renderPosition, collectedSetRef.current)
  })

  return <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
}

export default GameCanvas
