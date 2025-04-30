import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  loginWithPasskey: () => Promise<void>
  loginWithWeb3: (walletAddress: string) => Promise<void>
  logout: () => void
  
  // State setters
  setUser: (user: UserData | null) => void
  setLoading: (isLoading: boolean) => void
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
          // Implement Google login logic here
          // This would typically involve redirecting to Google OAuth
          // and handling the callback with user data
          
          // Mock implementation for now
          const mockUser: UserData = {
            id: 'google-user-id',
            name: 'Google User',
            email: 'user@gmail.com',
            image: 'https://example.com/avatar.png',
            provider: 'google'
          }
          
          set({ 
            user: mockUser,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Google login failed:', error)
          set({ isLoading: false })
        }
      },
      
      loginWithPasskey: async () => {
        try {
          set({ isLoading: true })
          // Implement WebAuthn/passkey login logic here
          // This would involve using the WebAuthn API
          
          // Mock implementation for now
          const mockUser: UserData = {
            id: 'passkey-user-id',
            name: 'Passkey User',
            email: 'passkey-user@example.com',
            image: null,
            provider: 'passkey'
          }
          
          set({ 
            user: mockUser,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Passkey login failed:', error)
          set({ isLoading: false })
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
      
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'auth-storage', // Name for localStorage key
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), // Only persist these fields
    }
  )
)
