import { create } from 'zustand'
import { api } from '@/lib/api'
import type { MinigameType, EnergyState, GradeResult } from '@monster-factory/shared'

interface MinigameResultResponse {
  gradeResult: GradeResult
  monster: unknown
}

interface GameState {
  currentMinigame: MinigameType | null
  energy: EnergyState | null
  setCurrentMinigame: (type: MinigameType | null) => void
  fetchEnergy: () => Promise<void>
  submitMinigameResult: (
    minigameType: MinigameType,
    score: number,
    inputLog: unknown,
  ) => Promise<GradeResult>
}

export const useGameStore = create<GameState>((set) => ({
  currentMinigame: null,
  energy: null,

  setCurrentMinigame: (type) => set({ currentMinigame: type }),

  fetchEnergy: async () => {
    try {
      const energy = await api.get<EnergyState>('/energy')
      set({ energy })
    } catch {
      // 에너지 조회 실패 시 무시
    }
  },

  submitMinigameResult: async (minigameType, score, inputLog) => {
    const result = await api.post<MinigameResultResponse>('/minigame/result', {
      minigameType,
      score,
      inputLog,
    })
    return result.gradeResult
  },
}))
