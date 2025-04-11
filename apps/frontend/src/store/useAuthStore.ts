import { create } from 'zustand'

type AuthState = {
    isAuth: boolean
    setIsAuth: (isAuth: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth: false,
    setIsAuth: (isAuth: boolean) => set({ isAuth })
}))