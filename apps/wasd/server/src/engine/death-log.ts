import type { DeathLogEntry } from '@wasd/shared'
import { DEATH_LOG_TICKS } from '@wasd/shared'

export class DeathLogManager {
  private buffer: DeathLogEntry[] = []

  record(entry: DeathLogEntry): void {
    this.buffer.push(entry)
    if (this.buffer.length > DEATH_LOG_TICKS) {
      this.buffer = this.buffer.slice(-DEATH_LOG_TICKS)
    }
  }

  getLog(): DeathLogEntry[] {
    return [...this.buffer]
  }

  getCulprit(): DeathLogEntry | null {
    if (this.buffer.length === 0) return null
    return this.buffer[this.buffer.length - 1] ?? null
  }

  clear(): void {
    this.buffer = []
  }
}
