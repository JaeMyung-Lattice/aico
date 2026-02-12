import type { TileMap, Position, Direction, GameState, Obstacle } from '@wasd/shared'
import { TileType, TILE_SIZE, PLAYER_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '@wasd/shared'

const COLORS = {
  bg: '#0f0f23',
  wall: '#4a4a6a',
  coin: '#ffd700',
  start: '#2ecc71',
  goal: '#e74c3c',
  player: '#00d4ff',
  playerOutline: '#0099cc',
  empty: '#1a1a2e',
  obstacle: '#ff6b6b',
  obstacleOutline: '#cc5555',
} as const

const renderTileMap = (
  ctx: CanvasRenderingContext2D,
  tileMap: TileMap,
  collectedCoins: Set<string>,
) => {
  for (let row = 0; row < tileMap.length; row++) {
    const tileRow = tileMap[row]
    if (!tileRow) continue
    for (let col = 0; col < tileRow.length; col++) {
      const tile = tileRow[col]
      const x = col * TILE_SIZE
      const y = row * TILE_SIZE

      switch (tile) {
        case TileType.WALL:
          ctx.fillStyle = COLORS.wall
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          ctx.strokeStyle = '#3a3a5a'
          ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1)
          break
        case TileType.COIN: {
          ctx.fillStyle = COLORS.empty
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          const key = `${row},${col}`
          if (!collectedCoins.has(key)) {
            ctx.fillStyle = COLORS.coin
            ctx.beginPath()
            ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 6, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        }
        case TileType.START:
          ctx.fillStyle = COLORS.start
          ctx.globalAlpha = 0.3
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          ctx.globalAlpha = 1
          break
        case TileType.GOAL:
          ctx.fillStyle = COLORS.goal
          ctx.globalAlpha = 0.4
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          ctx.globalAlpha = 1
          break
        default:
          ctx.fillStyle = COLORS.empty
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          break
      }
    }
  }
}

const renderPlayer = (
  ctx: CanvasRenderingContext2D,
  position: Position,
  direction: Direction,
) => {
  ctx.fillStyle = COLORS.player
  ctx.fillRect(position.x, position.y, PLAYER_SIZE, PLAYER_SIZE)

  ctx.strokeStyle = COLORS.playerOutline
  ctx.lineWidth = 1
  ctx.strokeRect(position.x + 0.5, position.y + 0.5, PLAYER_SIZE - 1, PLAYER_SIZE - 1)

  // 방향 표시 (삼각형)
  ctx.fillStyle = '#ffffff'
  const cx = position.x + PLAYER_SIZE / 2
  const cy = position.y + PLAYER_SIZE / 2
  const size = 3

  ctx.beginPath()
  switch (direction) {
    case 'up':
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx - size, cy + size)
      ctx.lineTo(cx + size, cy + size)
      break
    case 'down':
      ctx.moveTo(cx, cy + size)
      ctx.lineTo(cx - size, cy - size)
      ctx.lineTo(cx + size, cy - size)
      break
    case 'left':
      ctx.moveTo(cx - size, cy)
      ctx.lineTo(cx + size, cy - size)
      ctx.lineTo(cx + size, cy + size)
      break
    case 'right':
      ctx.moveTo(cx + size, cy)
      ctx.lineTo(cx - size, cy - size)
      ctx.lineTo(cx - size, cy + size)
      break
  }
  ctx.closePath()
  ctx.fill()
}

const renderObstacles = (ctx: CanvasRenderingContext2D, obstacles: Obstacle[]) => {
  for (const obs of obstacles) {
    ctx.fillStyle = COLORS.obstacle
    ctx.fillRect(obs.position.x, obs.position.y, obs.size.width, obs.size.height)
    ctx.strokeStyle = COLORS.obstacleOutline
    ctx.lineWidth = 1
    ctx.strokeRect(obs.position.x + 0.5, obs.position.y + 0.5, obs.size.width - 1, obs.size.height - 1)
  }
}

export const renderFrame = (
  ctx: CanvasRenderingContext2D,
  tileMap: TileMap,
  gameState: GameState,
  renderPosition: Position,
  collectedSet: Set<string>,
) => {
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  renderTileMap(ctx, tileMap, collectedSet)
  renderObstacles(ctx, gameState.obstacles)
  renderPlayer(ctx, renderPosition, gameState.direction)
}
