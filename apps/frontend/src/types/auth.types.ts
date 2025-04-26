export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  phone: string
  email: string
  password: string
}

export interface ResetPasswordData {
  token: string
  newPassword?: string
}
  