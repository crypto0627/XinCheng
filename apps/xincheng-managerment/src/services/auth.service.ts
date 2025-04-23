const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface ForgotPasswordParams {
  email: string;
}

interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthResponse {
  message: string;
  user?: User;
  token?: string;
  userId?: string;
  error?: string;
}

/**
 * Create authenticated request headers
 */
export const createAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY || '',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Register a new user
 */
export const register = async (params: RegisterParams): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: createAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in register:', error);
    return { error: 'Failed to register user', message: 'Registration failed' };
  }
};

/**
 * Login user
 */
export const login = async (params: LoginParams): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: createAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in login:', error);
    return { error: 'Failed to login', message: 'Login failed' };
  }
};

/**
 * Logout user
 */
export const logout = async (token?: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('Error in logout:', error);
    return { error: 'Failed to logout', message: 'Logout failed' };
  }
};

/**
 * Get current user
 */
export const getUser = async (token?: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: createAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`, {
      method: 'GET',
      headers: createAuthHeaders(),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return { error: 'Failed to verify email', message: 'Email verification failed' };
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (params: ForgotPasswordParams): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: createAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return { error: 'Failed to request password reset', message: 'Password reset request failed' };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (params: ResetPasswordParams): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: createAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return { error: 'Failed to reset password', message: 'Password reset failed' };
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: createAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in resendVerification:', error);
    return { error: 'Failed to resend verification email', message: 'Resend verification failed' };
  }
};