import { useRef, useEffect, useMemo } from 'react'
import type { GameState, TileMap } from '@wasd/shared'
import { TILE_SIZE } from '@wasd/shared'
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

  const { canvasWidth, canvasHeight } = useMemo(() => ({
    canvasWidth: (tileMap[0]?.length ?? 0) * TILE_SIZE,
    canvasHeight: tileMap.length * TILE_SIZE,
  }), [tileMap])

  useEffect(() => {
    if (shouldResetInterpolation(prevStateRef.current, gameState)) {
      interpRef.current = createInterpolationState(gameState.position)
    } else {
      // position이 실제 변경된 경우에만 보간 상태 리셋
      // 변경 없으면 lastUpdateTime 유지 → 외삽(extrapolation) 정상 작동
      const cur = interpRef.current.currentPosition
      if (cur.x !== gameState.position.x || cur.y !== gameState.position.y) {
        interpRef.current = updateInterpolationState(interpRef.current, gameState.position)
      }
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
  }, canvasWidth, canvasHeight)

  return <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
}

export default GameCanvas
