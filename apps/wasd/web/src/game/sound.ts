let ctx: AudioContext | null = null

export const initAudio = () => {
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') ctx.resume()
  } catch {
    /* AudioContext unavailable */
  }
}

const getContext = (): AudioContext | null => {
  if (!ctx || ctx.state === 'suspended') return null
  return ctx
}

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'square',
  volume = 0.1,
) => {
  const audioCtx = getContext()
  if (!audioCtx) return

  const oscillator = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
  gain.gain.setValueAtTime(volume, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)

  oscillator.connect(gain)
  gain.connect(audioCtx.destination)
  oscillator.start()
  oscillator.stop(audioCtx.currentTime + duration)
}

export const sound = {
  move: () => playTone(440, 0.05, 'square', 0.05),

  coin: () => playTone(880, 0.15, 'sine', 0.12),

  death: () => {
    playTone(200, 0.3, 'sawtooth', 0.08)
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.06), 100)
  },

  stageClear: () => {
    playTone(523, 0.15, 'sine', 0.1)
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 150)
    setTimeout(() => playTone(784, 0.3, 'sine', 0.12), 300)
  },

  gameComplete: () => {
    playTone(523, 0.15, 'sine', 0.1)
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 150)
    setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 300)
    setTimeout(() => playTone(1047, 0.4, 'sine', 0.12), 450)
  },

  countdown: () => playTone(660, 0.1, 'sine', 0.08),

  countdownGo: () => playTone(880, 0.2, 'sine', 0.12),
}
