import type { Server } from 'socket.io'
import type { GamePhase } from '@wasd/shared'
import { TICK_INTERVAL, STAGES, STAGE_OBSTACLES, SocketEvents } from '@wasd/shared'
import { ServerGameState, type InputEntry } from './game-state.js'
import { applyMovement, keyToDirection } from './movement.js'
import { checkWallCollision, checkCoinCollection, checkGoalReached } from './collision.js'
import { DeathLogManager } from './death-log.js'
import { ObstacleManager } from './obstacle.js'

const STAGE_CLEAR_DELAY = 2000

export const gameLoops = new Map<string, GameLoop>()

export class GameLoop {
  private state: ServerGameState
  private deathLog: DeathLogManager
  private obstacleManager: ObstacleManager
  private intervalId: ReturnType<typeof setInterval> | null = null
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private currentTick = 0
  private roomCode: string
  private io: Server

  constructor(roomCode: string, io: Server) {
    this.roomCode = roomCode
    this.io = io
    this.state = new ServerGameState(1)
    this.deathLog = new DeathLogManager()
    this.obstacleManager = new ObstacleManager(STAGE_OBSTACLES[0] ?? [])
  }

  start(): void {
    this.intervalId = setInterval(() => this.update(), TICK_INTERVAL)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  queueInput(entry: InputEntry): void {
    this.state.pendingInputs.push(entry)
  }

  private update(): void {
    if (this.state.phase !== 'playing') return

    this.currentTick++
    this.obstacleManager.update()
    this.state.obstacles = this.obstacleManager.getObstacles()

    if (this.obstacleManager.checkCollision(this.state.position)) {
      this.handleDeath('obstacle')
      return
    }

    const inputs = [...this.state.pendingInputs]
    this.state.pendingInputs = []

    if (inputs.length === 0) {
      this.broadcast()
      return
    }

    for (const input of inputs) {
      const direction = keyToDirection(input.key)
      const nextPosition = applyMovement(this.state.position, direction)

      this.deathLog.record({
        tick: this.currentTick,
        key: input.key,
        playerId: input.playerId,
        nickname: input.nickname,
        direction,
      })

      if (checkWallCollision(nextPosition, this.state.tileMap) || this.obstacleManager.checkCollision(nextPosition)) {
        this.handleDeath()
        return
      }

      this.state.position = nextPosition
      this.state.direction = direction

      if (this.obstacleManager.checkCollision(this.state.position)) {
        this.handleDeath('obstacle')
        return
      }

      const collected = checkCoinCollection(nextPosition, this.state.tileMap, this.state.collectedCoins)
      for (const key of collected) {
        this.state.collectedCoins.add(key)
        this.state.coins++
      }

      if (this.state.coins >= this.state.totalCoins && checkGoalReached(nextPosition, this.state.tileMap)) {
        this.handleStageClear()
        return
      }
    }

    this.broadcast()
  }

  private handleDeath(cause: 'input' | 'obstacle' = 'input'): void {
    this.state.deaths++
    this.state.resetPosition()

    const culprit = cause === 'input' ? this.deathLog.getCulprit() : null
    this.io.to(this.roomCode).emit(SocketEvents.DEATH, {
      deaths: this.state.deaths,
      log: this.deathLog.getLog(),
      culpritId: culprit?.playerId ?? '',
      culpritNickname: cause === 'obstacle' ? '장애물' : (culprit?.nickname ?? ''),
    })

    this.deathLog.clear()
    this.broadcast()
  }

  private handleStageClear(): void {
    const nextStage = this.state.stage + 1

    if (nextStage > STAGES.length) {
      this.state.phase = 'complete' as GamePhase
      this.io.to(this.roomCode).emit(SocketEvents.GAME_COMPLETE, {
        deaths: this.state.deaths,
        elapsedTime: Date.now() - this.state.startTime,
      })
      this.stop()
      return
    }

    this.state.phase = 'stage-clear' as GamePhase
    this.io.to(this.roomCode).emit(SocketEvents.STAGE_CLEAR, {
      stage: this.state.stage,
      nextStage,
      deaths: this.state.deaths,
    })

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null
      this.state = new ServerGameState(nextStage, this.state.deaths)
      this.obstacleManager = new ObstacleManager(STAGE_OBSTACLES[nextStage - 1] ?? [])
      this.deathLog.clear()
      this.currentTick = 0
      this.broadcast()
    }, STAGE_CLEAR_DELAY)
  }

  private broadcast(): void {
    this.io.to(this.roomCode).emit(SocketEvents.GAME_STATE, this.state.toGameState())
  }
}
