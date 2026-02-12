import type { Position, GameState } from '@wasd/shared'
import { TICK_INTERVAL } from '@wasd/shared'

interface InterpolationState {
  prevPosition: Position
  currentPosition: Position
  lastUpdateTime: number
}

export const createInterpolationState = (position: Position): InterpolationState => ({
  prevPosition: { ...position },
  currentPosition: { ...position },
  lastUpdateTime: performance.now(),
})

export const updateInterpolationState = (
  state: InterpolationState,
  newPosition: Position,
): InterpolationState => ({
  prevPosition: { ...state.currentPosition },
  currentPosition: { ...newPosition },
  lastUpdateTime: performance.now(),
})

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const getInterpolatedPosition = (state: InterpolationState): Position => {
  const elapsed = performance.now() - state.lastUpdateTime
  const t = clamp(elapsed / TICK_INTERVAL, 0, 1)

  return {
    x: lerp(state.prevPosition.x, state.currentPosition.x, t),
    y: lerp(state.prevPosition.y, state.currentPosition.y, t),
  }
}

export const shouldResetInterpolation = (
  prev: GameState | null,
  current: GameState,
): boolean => {
  if (!prev) return true
  if (prev.stage !== current.stage) return true
  if (prev.deaths !== current.deaths) return true
  return false
}
