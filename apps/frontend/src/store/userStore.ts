import { create } from 'zustand'
import { authService } from '@/services/authService'

interface User {
  id: string;
  name?: string;
  phone?: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  userData: User | null
  isAuth: boolean
  setUserData: (userData: User | null) => void
  setIsAuth: (isAuth: boolean) => void
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  userData: null,
  isAuth: false,
  setUserData: (userData) => set({ userData }),
  setIsAuth: (isAuth) => set({ isAuth }),
  checkAuth: async () => {
    try {
      const response = await authService.getCurrentUser()
      if (response && response.id) {
        set({ userData: response, isAuth: true })
      } else {
        set({ userData: null, isAuth: false })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      set({ userData: null, isAuth: false })
    }
  },
  logout: async () => {
    try {
      await authService.logout()
      set({ userData: null, isAuth: false })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
})) 