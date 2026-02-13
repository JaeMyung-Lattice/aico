export interface UserProfile {
  id: string
  supabaseId: string
  nickname: string | null
  gold: number
  tutorialCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface EnergyState {
  remaining: number
  max: number
  nextResetAt: string
}
