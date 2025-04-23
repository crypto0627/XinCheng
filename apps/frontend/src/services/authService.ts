import { LoginCredentials, RegisterCredentials, ResetPasswordData } from "@/types/auth.types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY || ''
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers,
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
      headers,
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
      headers,
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
      headers,
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
      headers,
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
      headers,
      body: JSON.stringify(data)
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || '重設密碼失敗')
    }

    return responseData
  },

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers,
      })
      
      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        return null
      }
      return data
    } catch (error) {
      console.error('getCurrentUser - Fetch error:', error)
      return null
    }
  },

  // Google OAuth
  async googleLogin() {
    window.location.href = `${API_URL}/api/auth/google/login`
  },

  // This method will be called when user comes back from Google OAuth
  async handleGoogleCallback() {
    try {
      const user = await this.getCurrentUser()
      return user
    } catch (error) {
      console.error('Google callback error:', error)
      return null
    }
  },

  async updateUser(userData: {id: string, name?: string, email?: string, address?: string, passwordHash?: string}) {
    const response = await fetch(`${API_URL}/api/user/updateUser`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(userData)
    });

    try {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '更新用戶資料失敗');
      }
      return data;
    } catch (error) {
      console.error('JSON parsing error:', error);
      if (!response.ok) {
        throw new Error('更新用戶資料失敗 - 伺服器回應錯誤');
      }
      throw error;
    }
  },

  async deleteUser(id: string) {
    const response = await fetch(`${API_URL}/api/user/deleteUser`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ id })
    })

    try {
      const data = await response.json()
      if(!response.ok) {
        throw new Error(data.error || '刪除失敗')
      }
      return data
    } catch (error) {
      console.error('JSON parsing error:', error)
      if (!response.ok) {
        throw new Error('刪除失敗 - 伺服器回應錯誤')
      }
      throw error
    }
  }
} 