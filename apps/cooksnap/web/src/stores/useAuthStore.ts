import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  isLoading: boolean
  initialize: () => Promise<void>
  signInWithKakao: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  initialize: async () => {
    if (!supabase) {
      set({ user: null, isLoading: false })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        localStorage.setItem('access_token', session.access_token)
        set({ user: null, isLoading: false })
      } else {
        localStorage.removeItem('access_token')
        set({ user: null, isLoading: false })
      }
    } catch {
      set({ user: null, isLoading: false })
    }
  },

  signInWithKakao: async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    })
  },

  signInWithGoogle: async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    localStorage.removeItem('access_token')
    set({ user: null })
  },
}))
