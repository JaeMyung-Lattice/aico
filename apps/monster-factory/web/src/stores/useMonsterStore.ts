import { create } from 'zustand'
import { api } from '@/lib/api'
import type { Monster } from '@monster-factory/shared'

interface MonsterState {
  monster: Monster | null
  loading: boolean
  fetchMonster: () => Promise<void>
  hatchMonster: () => Promise<Monster>
}

export const useMonsterStore = create<MonsterState>((set) => ({
  monster: null,
  loading: true,

  fetchMonster: async () => {
    try {
      const monster = await api.get<Monster | null>('/monsters/me')
      set({ monster, loading: false })
    } catch {
      set({ monster: null, loading: false })
    }
  },

  hatchMonster: async () => {
    const monster = await api.post<Monster>('/monsters/hatch')
    set({ monster })
    return monster
  },
}))
