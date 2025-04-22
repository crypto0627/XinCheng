import { create } from 'zustand'
import { authService } from '@/services/authService'

type AuthState = {
  user: any | null
  loading: boolean
  checkAuth: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  checkAuth: async () => {
    try {
      const user = await authService.getCurrentUser()
      set({ user, loading: false })
    } catch (error) {
      set({ user: null, loading: false })
    }
  },
  logout: async() => {
    set({ user: null })
    await authService.logout()
  }
}))
