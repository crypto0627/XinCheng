import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { Context } from 'hono';
import { getDB } from '../db';
import * as authService from '../services/auth.service';
import { v4 as uuidv4 } from 'uuid';

// 註冊
export const register = async (c: Context) => {
  try {
    const db = getDB(c);
    const { name, phone, email, address, password } = await c.req.json();

    // 驗證必要字段
    const validation = authService.validateRegistrationData(name, phone, email, address, password);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }

    const existingUser = await authService.checkExistingUser(db, email);
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const id = uuidv4();
    const hash = await authService.hashPassword(password);

    // 先創建驗證 token，確保可以發送郵件後再創建用戶
    const verificationToken = await authService.generateToken({ userId: id }, c.env.JWT_SECRET);
    
    try {
      // 嘗試發送驗證郵件
      await authService.sendVerificationEmail(email, verificationToken, c.env.RESEND_API_KEY, c.env.TEST_BASE_URL);
      
      // 郵件發送成功後，再創建用戶
      await authService.createUser(db, id, name, phone, email, address, hash);
      
      return c.json({ 
        message: 'Registration successful. Please check your email to verify your account.',
        userId: id
      }, 201);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // 郵件發送失敗，不創建用戶
      return c.json({ 
        error: 'Failed to send verification email. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ 
      error: 'An error occurred during registration. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};

// 登入
export const login = async (c: Context) => {
  const db = getDB(c);
  const { email, password } = await c.req.json();

  const user = await authService.checkExistingUser(db, email);
  if (!user) return c.json({ error: 'Can not find user' }, 401);
  if (!user.isVerified) return c.json({ error: 'Email not verified, please verify your email' }, 401);

  const isValid = await authService.comparePasswords(password, user.passwordHash);
  if (!isValid) return c.json({ error: 'Password is incorrect, please try again' }, 401);

  const token = await authService.generateToken({
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  }, c.env.JWT_SECRET);

  setCookie(c, 'auth_token', token, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'Strict',
  });

  return c.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};

// 登出
export const logout = async (c: Context) => {
  const token = getCookie(c, 'auth_token');
  if (!token) return c.json({ error: 'You are not logged in' }, 401);
  deleteCookie(c, 'auth_token');
  return c.json({ message: 'Logged out' });
};

// 驗證 Email
export const verifyEmail = async (c: Context) => {
  const db = getDB(c);
  const { token } = await c.req.json();

  try {
    const payload = await authService.verifyToken(token, c.env.JWT_SECRET);
    await authService.updateUserVerificationStatus(db, payload.userId as string);
    return c.json({ message: 'Email verified successfully' });
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 400);
  }
};

// 發送密碼重設信
export const requestPasswordReset = async (c: Context) => {
  const db = getDB(c);
  const { email } = await c.req.json();

  const user = await authService.checkExistingUser(db, email);
  if (!user) {
    return c.json({ message: 'If account exists, reset email sent' });
  }

  const token = await authService.createPasswordResetToken(db, user.id);
  await authService.sendPasswordResetEmail(email, token, c.env.RESEND_API_KEY, c.env.TEST_BASE_URL);

  return c.json({ message: 'Password reset email sent' });
};

// 密碼重設
export const resetPassword = async (c: Context) => {
  const db = getDB(c);
  const { token, newPassword } = await c.req.json();

  const resetToken = await authService.getPasswordResetToken(db, token);
  if (!resetToken) return c.json({ error: 'Invalid or expired token' }, 400);

  const hash = await authService.hashPassword(newPassword);
  await authService.updatePassword(db, resetToken.userId, resetToken.id, hash);

  return c.json({ message: 'Password reset successful' });
};
