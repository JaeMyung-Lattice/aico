import Phaser from 'phaser'
import { eventBus } from '@/lib/event-bus'

/**
 * 패턴 기억 (DEF)
 * 3x3 그리드에 패턴 표시 → 기억하고 재현
 */
export class PatternMemoryScene extends Phaser.Scene {
  private cells: Phaser.GameObjects.Rectangle[] = []
  private pattern: number[] = []
  private userInput: number[] = []
  private patternLength = 3
  private round = 0
  private maxRounds = 5
  private scores: number[] = []
  private isShowingPattern = false
  private isInputPhase = false

  constructor() {
    super({ key: 'PatternMemoryScene' })
  }

  create() {
    this.cells = []
    this.round = 0
    this.scores = []
    this.createGrid()
    this.startRound()
  }

  private createGrid() {
    const { width, height } = this.scale
    const cellSize = Math.min(width, height) * 0.2
    const gap = 10
    const startX = width / 2 - (cellSize + gap)
    const startY = height / 2 - (cellSize + gap)

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * (cellSize + gap)
        const y = startY + row * (cellSize + gap)
        const cell = this.add
          .rectangle(x, y, cellSize, cellSize, 0x16213e)
          .setStrokeStyle(2, 0x0f3460)
          .setInteractive()

        cell.on('pointerdown', () => this.handleCellTap(row * 3 + col))
        this.cells.push(cell)
      }
    }
  }

  private startRound() {
    this.pattern = []
    this.userInput = []
    this.isShowingPattern = true
    this.isInputPhase = false

    // 랜덤 패턴 생성
    const available = Array.from({ length: 9 }, (_, i) => i)
    for (let i = 0; i < this.patternLength; i++) {
      const idx = Math.floor(Math.random() * available.length)
      this.pattern.push(available.splice(idx, 1)[0]!)
    }

    // 패턴 표시
    this.showPattern()
  }

  private showPattern() {
    let delay = 0
    for (const cellIdx of this.pattern) {
      this.time.delayedCall(delay, () => {
        const cell = this.cells[cellIdx]!
        cell.setFillStyle(0xe94560)
        this.time.delayedCall(400, () => {
          cell.setFillStyle(0x16213e)
        })
      })
      delay += 600
    }

    this.time.delayedCall(delay + 200, () => {
      this.isShowingPattern = false
      this.isInputPhase = true
    })
  }

  private handleCellTap(index: number) {
    if (!this.isInputPhase || this.isShowingPattern) return

    this.userInput.push(index)
    const cell = this.cells[index]!
    cell.setFillStyle(0x38bdf8)
    this.time.delayedCall(200, () => cell.setFillStyle(0x16213e))

    if (this.userInput.length === this.pattern.length) {
      this.isInputPhase = false
      this.evaluateRound()
    }
  }

  private evaluateRound() {
    let correct = 0
    for (let i = 0; i < this.pattern.length; i++) {
      if (this.userInput[i] === this.pattern[i]) correct++
    }

    const roundScore = Math.floor((correct / this.pattern.length) * 10000)
    this.scores.push(roundScore)
    this.round++

    if (this.round >= this.maxRounds) {
      const totalScore = Math.floor(
        this.scores.reduce((a, b) => a + b, 0) / this.scores.length,
      )
      eventBus.emit('minigame:complete', {
        minigameType: 'PatternMemory',
        score: totalScore,
        inputLog: { pattern: this.pattern, userInput: this.userInput },
      })
    } else {
      this.patternLength = Math.min(this.patternLength + 1, 7)
      this.time.delayedCall(500, () => this.startRound())
    }
  }
}
