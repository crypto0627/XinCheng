const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
}

interface ResetPasswordData {
  token: string
  newPassword?: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || '登入失敗')
    }
    

    return data
  },

  async register(credentials: RegisterCredentials) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || '註冊失敗')
    }

    return data
  },

  async logout() {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      }
    })

    if (!response.ok) {
      throw new Error('登出失敗')
    }

    return response.json()
  },

  async verifyEmail(token: string) {
    const response = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      },
      body: JSON.stringify({ token })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || '驗證失敗')
    }

    return data
  },

  async requestPasswordReset(email: string) {
    const response = await fetch(`${API_URL}/api/auth/request-password-reset`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || '重設密碼請求失敗')
    }

    return data
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || '重設密碼失敗')
    }

    return responseData
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-API-KEY': API_KEY || ''
      }
    })

    const data = await response.json()
    if (!response.ok) {
      return null
    }
    return data
  },

  // Google OAuth
  async googleLogin() {
    window.location.href = `${API_URL}/api/auth/google/login`
  }
} 