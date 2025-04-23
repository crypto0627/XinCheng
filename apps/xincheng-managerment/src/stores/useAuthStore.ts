import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
  role?: string
  isVerified?: boolean
}

type AuthState = {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (user: User, token?: string) => void
  logout: () => void
  register: (user: User, token?: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      register: (user, token) => set({ user, token, isLoggedIn: true }),
    }),
    {
      name: 'auth-storage',
    }
  )
) 