import Phaser from 'phaser'
import { eventBus } from '@/lib/event-bus'

/**
 * 연타 챌린지 (HP)
 * 제한 시간 내 최대한 많이 탭
 */
export class MashChallengeScene extends Phaser.Scene {
  private tapCount = 0
  private timeLeft = 10000 // 10초
  private taps: number[] = []
  private isActive = false
  private countText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private tapZone!: Phaser.GameObjects.Rectangle
  private startTime = 0

  constructor() {
    super({ key: 'MashChallengeScene' })
  }

  create() {
    const { width, height } = this.scale

    this.tapCount = 0
    this.taps = []
    this.timeLeft = 10000
    this.startTime = Date.now()
    this.isActive = true

    // 탭 영역
    this.tapZone = this.add
      .rectangle(width / 2, height / 2, width * 0.6, width * 0.6, 0xe94560, 0.3)
      .setStrokeStyle(3, 0xe94560)
      .setInteractive()

    // 카운트 텍스트
    this.countText = this.add
      .text(width / 2, height / 2 - 20, '0', {
        fontSize: '64px',
        color: '#ffd700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    // 타이머 텍스트
    this.timerText = this.add
      .text(width / 2, height / 2 + 60, '10.0s', {
        fontSize: '24px',
        color: '#eee',
      })
      .setOrigin(0.5)

    // 안내
    this.add
      .text(width / 2, height * 0.15, 'TAP! TAP! TAP!', {
        fontSize: '28px',
        color: '#e94560',
      })
      .setOrigin(0.5)

    this.tapZone.on('pointerdown', () => {
      if (!this.isActive) return
      this.tapCount++
      this.taps.push(Date.now() - this.startTime)
      this.countText.setText(String(this.tapCount))

      // 시각 피드백
      this.tweens.add({
        targets: this.tapZone,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
      })
    })
  }

  update() {
    if (!this.isActive) return

    const elapsed = Date.now() - this.startTime
    this.timeLeft = Math.max(0, 10000 - elapsed)
    this.timerText.setText(`${(this.timeLeft / 1000).toFixed(1)}s`)

    if (this.timeLeft <= 0) {
      this.isActive = false
      // 최대 약 150탭이면 만점
      const score = Math.min(10000, Math.floor((this.tapCount / 150) * 10000))
      eventBus.emit('minigame:complete', {
        minigameType: 'MashChallenge',
        score,
        inputLog: { taps: this.taps, durationMs: 10000 },
      })
    }
  }
}
