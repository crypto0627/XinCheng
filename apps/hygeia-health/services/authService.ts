import base64url from 'base64url'
import { startAuthentication } from '@simplewebauthn/browser'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY || ''
}

export const authService = {
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers
      });
      return response.json()
    } catch (error) {
      throw new Error('Error fetch /me: ' + (error as Error).message)
    }
  },

  // Google OAuth
  async googleLogin() {
    window.location.href = `${API_URL}/api/auth/google/login`
  },

  async handleGoogleCallback() {
    try {
      const user = await this.getCurrentUser()
      return user
    } catch (error) {
      console.error('Google callback error:', error)
      return null
    }
  },
  
  async checkPasskeyRegistered(email: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/webauthn/login/options`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ email })
      })

      const options = await response.json()
      
      let credential = await startAuthentication(options)

      const verificationResp = await fetch(`${API_URL}/api/auth/webauthn/login/verify`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ credential, userId: options.userId })
      })

      const result = await verificationResp.json()
      if (result && result.verified) {
        return result
      } else {
        throw new Error('Passkey login failed')
      }
    } catch (error) {
      console.error('Passkey registration error:', error)
      throw error
    }
  },

  async handlePasskeyRegister(name: string, email: string) {
    try {
      // 1️⃣ 向後端請求註冊 options
      const response = await fetch(`${API_URL}/api/auth/webauthn/register/options`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ name, email })
      })

      const options = await response.json()

      options.user.id = base64url.toBuffer(options.user.id)
      options.challenge = base64url.toBuffer(options.challenge)
      
      // 2️⃣ 建立 passkey
      const credential = await navigator.credentials.create({ publicKey: options }) as PublicKeyCredential

      if (!credential) {
        throw new Error('Failed to create credential')
      }
    
      const publicKeyCredential = credential as PublicKeyCredential
      const attestationResponse = publicKeyCredential.response as AuthenticatorAttestationResponse

      const id = base64url.encode(Buffer.from(credential.rawId as ArrayBuffer));
      const rawId = id; // rawId 應與 id 相同，並以 base64url 編碼

      const attestationObject = base64url.encode(Buffer.from(attestationResponse.attestationObject));
      const clientDataJSON = base64url.encode(Buffer.from(attestationResponse.clientDataJSON));


      // 3️⃣ 傳給後端驗證
      const verificationRes = await fetch(`${API_URL}/api/auth/webauthn/register/verify`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          userId: options.user.id,
          credential: {
            id,
            rawId,
            type: credential.type,
            response: {
              attestationObject,
              clientDataJSON
            }
          }
        })
      })

      const result = await verificationRes.json()
      return result
    } catch (error) {
      console.error('Passkey registration error:', error)
      throw error
    }
  }
}
