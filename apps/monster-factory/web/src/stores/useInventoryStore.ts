import { create } from 'zustand'
import { api } from '@/lib/api'
import type { Equipment } from '@monster-factory/shared'

interface InventoryState {
  equipment: Equipment[]
  loading: boolean
  fetchInventory: () => Promise<void>
  equipItem: (equipmentId: string) => Promise<void>
  unequipItem: (equipmentId: string) => Promise<void>
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  equipment: [],
  loading: true,

  fetchInventory: async () => {
    try {
      const equipment = await api.get<Equipment[]>('/inventory')
      set({ equipment, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  equipItem: async (equipmentId) => {
    const updated = await api.post<Equipment>('/inventory/equip', { equipmentId })
    set({
      equipment: get().equipment.map((e) => {
        if (e.id === updated.id) return updated
        // 같은 슬롯의 다른 장비는 해제
        if (e.slot === updated.slot && e.monsterId) return { ...e, monsterId: null }
        return e
      }),
    })
  },

  unequipItem: async (equipmentId) => {
    const updated = await api.post<Equipment>('/inventory/unequip', { equipmentId })
    set({
      equipment: get().equipment.map((e) =>
        e.id === updated.id ? updated : e,
      ),
    })
  },
}))
