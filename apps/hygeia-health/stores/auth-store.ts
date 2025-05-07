import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/authService'

// Define the types for user data
type UserData = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  provider: 'google' | 'passkey' | 'web3' | null
  walletAddress?: string // Only for web3 login
}

// Define the auth store state
interface AuthState {
  // User state
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Auth actions
  loginWithGoogle: () => Promise<void>
  checkUserInfoWithPasskey: (email: string) => Promise<void>
  loginWithPasskey: (email: string, name: string) => Promise<void>
  loginWithWeb3: (walletAddress: string) => Promise<void>
  logout: () => void
  
  // State setters
  setUser: (user: UserData | null) => void
  setLoading: (isLoading: boolean) => void
  checkAuthStatus: () => Promise<void>
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Auth actions
      loginWithGoogle: async () => {
        try {
          set({ isLoading: true })
          await authService.googleLogin()
        } catch (error) {
          console.error('Google login failed:', error)
          set({ isLoading: false })
        }
      },
      
      checkUserInfoWithPasskey: async (email: string) => {
        try {
          set({ isLoading: true })

          // Call
          const result = await authService.checkPasskeyRegistered(email)
          if (result && result.verified) {
            const userData = await authService.getCurrentUser()
            if (userData) {
              set({
                user: {
                  id: userData.id,
                  name: userData.name,
                  email: userData.email,
                  image: null,
                  provider: 'passkey'
                },
                isAuthenticated: true,
                isLoading: false
              })
            }
          } else {
            throw new Error('Passkey login failed')
          }
        } catch (error) {
          console.error('Passkey login failed:', error)
          set({ isLoading: false })
          throw error // Re-throw to allow the UI to handle the error
        }
      },

      loginWithPasskey: async (email: string, name: string) => {
        try {
          set({ isLoading: true })
          
          // Call the auth service to handle passkey registration
          const result = await authService.handlePasskeyRegister(name, email)
          
          if (result && result.verified) {
            // After successful registration, get the current user
            const userData = await authService.getCurrentUser()
            
            if (userData) {
              set({ 
                user: {
                  id: userData.id,
                  name: userData.name,
                  email: userData.email,
                  image: null,
                  provider: 'passkey'
                },
                isAuthenticated: true,
                isLoading: false
              })
            }
          } else {
            throw new Error('Passkey registration failed')
          }
        } catch (error) {
          console.error('Passkey login failed:', error)
          set({ isLoading: false })
          throw error // Re-throw to allow the UI to handle the error
        }
      },
      
      loginWithWeb3: async (walletAddress: string) => {
        try {
          set({ isLoading: true })
          // Implement Web3 wallet login logic here
          // This would involve wallet connection and signature verification
          
          // Mock implementation for now
          const mockUser: UserData = {
            id: walletAddress,
            name: `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
            email: null,
            image: null,
            provider: 'web3',
            walletAddress
          }
          
          set({ 
            user: mockUser,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Web3 login failed:', error)
          set({ isLoading: false })
        }
      },
      
      logout: () => {
        // Clear user data and set authenticated to false
        set({ 
          user: null,
          isAuthenticated: false
        })
      },
      
      // State setters
      setUser: (user) => set({ 
        user,
        isAuthenticated: !!user
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      checkAuthStatus: async () => {
        try {
          set({ isLoading: true })
          const userData = await authService.getCurrentUser()
          if (userData) {
            set({ 
              user: userData,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Error checking auth status:', error)
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)
