import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { Context } from 'hono';
import { getDB } from '../db';
import * as authService from '../services/auth.service';
import { v4 as uuidv4 } from 'uuid';

// 註冊
export const register = async (c: Context) => {
  try {
    const db = getDB(c);
    const { name, phone, email, password } = await c.req.json();

    // 驗證必要字段
    const validation = authService.validateRegistrationData(name, phone, email, password);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }

    const existingUser = await authService.checkExistingUser(db, email);
    if (existingUser) {
      return c.json({ error: '此電子郵件已註冊' }, 400);
    }

    const id = uuidv4();
    const hash = await authService.hashPassword(password);

    // 先創建驗證 token，確保可以發送郵件後再創建用戶
    const verificationToken = await authService.generateToken({ userId: id }, c.env.JWT_SECRET);
    
    try {
      // 嘗試發送驗證郵件
      await authService.sendVerificationEmail(email, verificationToken, c.env.RESEND_API_KEY, c.env.BASE_URL);
      
      // 郵件發送成功後，再創建用戶
      await authService.createUser(db, id, name, phone, email, hash);
      
      return c.json({ 
        message: '註冊成功。請檢查您的電子郵件以驗證您的帳戶。',
        userId: id
      }, 201);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // 郵件發送失敗，不創建用戶
      return c.json({ 
        error: '發送驗證郵件失敗。請稍後再試。',
        details: error instanceof Error ? error.message : '未知錯誤'
      }, 500);
    }
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ 
      error: '註冊過程中發生錯誤。請再試一次。',
      details: error instanceof Error ? error.message : '未知錯誤'
    }, 500);
  }
};

// 登入
export const login = async (c: Context) => {
  const db = getDB(c);
  const { email, password } = await c.req.json();

  const user = await authService.checkExistingUser(db, email);
  if (!user) return c.json({ error: '找不到用戶' }, 401);
  if (!user.isVerified) return c.json({ error: '電子郵件尚未驗證，請驗證您的電子郵件' }, 401);

  const isValid = await authService.comparePasswords(password, user.passwordHash);
  if (!isValid) return c.json({ error: '密碼不正確，請重試' }, 401);

  const token = await authService.generateToken({
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  }, c.env.JWT_SECRET);

  setCookie(c, 'auth_token', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    domain: 'api.xincheng-brunch.com',
  });

  return c.json({
    message: '登入成功',
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
  if (!token) return c.json({ error: '您尚未登入' }, 401);
  deleteCookie(c, 'auth_token');
  return c.json({ message: '已登出' });
};

// 驗證 Email
export const verifyEmail = async (c: Context) => {
  const db = getDB(c);
  const { token } = await c.req.json();

  try {
    const payload = await authService.verifyToken(token, c.env.JWT_SECRET);
    await authService.updateUserVerificationStatus(db, payload.userId as string);
    return c.json({ message: '電子郵件驗證成功' });
  } catch {
    return c.json({ error: '無效或過期的令牌' }, 400);
  }
};

// 發送密碼重設信
export const requestPasswordReset = async (c: Context) => {
  const db = getDB(c);
  const { email } = await c.req.json();

  const user = await authService.checkExistingUser(db, email);
  if (!user) {
    return c.json({ message: '如果帳戶存在，重設郵件已發送' });
  }

  const token = await authService.createPasswordResetToken(db, user.id);
  await authService.sendPasswordResetEmail(email, token, c.env.RESEND_API_KEY, c.env.BASE_URL);

  return c.json({ message: '密碼重設郵件已發送' });
};

// 密碼重設
export const resetPassword = async (c: Context) => {
  const db = getDB(c);
  const { token, newPassword } = await c.req.json();

  const resetToken = await authService.getPasswordResetToken(db, token);
  if (!resetToken) return c.json({ error: '無效或過期的令牌' }, 400);

  const hash = await authService.hashPassword(newPassword);
  await authService.updatePassword(db, resetToken.userId, resetToken.id, hash);

  return c.json({ message: '密碼重設成功' });
};
