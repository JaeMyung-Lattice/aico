export const TileType = {
  EMPTY: 0,
  WALL: 1,
  COIN: 2,
  START: 3,
  GOAL: 4,
  MOVING_OBSTACLE: 5,
} as const

export type TileType = (typeof TileType)[keyof typeof TileType]
