import Phaser from 'phaser'
import { eventBus } from '@/lib/event-bus'

/**
 * 타이밍 클릭 (ATK)
 * 게이지가 좌우 왕복 → 중앙(50) 근처에서 탭 → 점수
 */
export class TimingClickScene extends Phaser.Scene {
  private gauge!: Phaser.GameObjects.Rectangle
  private marker!: Phaser.GameObjects.Rectangle
  private targetZone!: Phaser.GameObjects.Rectangle
  private position = 0
  private speed = 3
  private direction = 1
  private rounds = 0
  private maxRounds = 5
  private scores: number[] = []
  private isActive = false

  constructor() {
    super({ key: 'TimingClickScene' })
  }

  create() {
    const { width, height } = this.scale

    // 배경 게이지 바
    this.gauge = this.add.rectangle(width / 2, height / 2, width * 0.8, 40, 0x16213e)
    this.gauge.setStrokeStyle(2, 0xe94560)

    // 타겟 존 (중앙 20%)
    const gaugeLeft = width * 0.1
    const gaugeWidth = width * 0.8
    const targetWidth = gaugeWidth * 0.2
    this.targetZone = this.add.rectangle(
      width / 2,
      height / 2,
      targetWidth,
      40,
      0x4ade80,
      0.3,
    )

    // 이동 마커
    this.marker = this.add.rectangle(gaugeLeft, height / 2, 8, 50, 0xe94560)

    // 라운드 텍스트
    this.add.text(width / 2, height / 2 - 80, 'TAP!', {
      fontSize: '24px',
      color: '#eee',
    }).setOrigin(0.5)

    this.position = 0
    this.rounds = 0
    this.scores = []
    this.isActive = true

    this.input.on('pointerdown', () => {
      if (!this.isActive) return
      this.handleTap()
    })
  }

  update() {
    if (!this.isActive) return

    const { width } = this.scale
    const gaugeLeft = width * 0.1
    const gaugeWidth = width * 0.8

    this.position += this.speed * this.direction
    if (this.position >= 100 || this.position <= 0) {
      this.direction *= -1
    }

    const markerX = gaugeLeft + (this.position / 100) * gaugeWidth
    this.marker.setX(markerX)
  }

  private handleTap() {
    // 50이 중앙, 거리가 가까울수록 높은 점수
    const distance = Math.abs(this.position - 50)
    const roundScore = Math.max(0, Math.floor(((50 - distance) / 50) * 10000))
    this.scores.push(roundScore)

    this.rounds++

    if (this.rounds >= this.maxRounds) {
      this.isActive = false
      const totalScore = Math.floor(
        this.scores.reduce((a, b) => a + b, 0) / this.scores.length,
      )
      eventBus.emit('minigame:complete', {
        minigameType: 'TimingClick',
        score: totalScore,
        inputLog: { scores: this.scores },
      })
    }
  }
}
