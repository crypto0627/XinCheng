import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { Context } from 'hono';
import { getDB } from '../db';
import * as authService from '../services/auth.service';
import { v4 as uuidv4 } from 'uuid';

// 註冊
export const register = async (c: Context) => {
  try {
    const { name, phone, email, password } = await c.req.json();
    const kv = c.env.AUTH_KV as KVNamespace;

    const validation = authService.validateRegistrationData(name, phone, email, password);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }

    const db = getDB(c);
    const existingUser = await authService.checkExistingUser(db, email);
    if (existingUser) {
      return c.json({ error: '此電子郵件已註冊' }, 400);
    }

    const pendingKey = `pending:${email}`;
    const existingPending = await kv.get(pendingKey);
    if (existingPending) {
      return c.json({ error: '您已經申請註冊，請先完成信箱驗證' }, 400);
    }

    const id = uuidv4();
    const hash = await authService.hashPassword(password);
    const token = await authService.generateToken({ userId: id, email }, c.env.JWT_SECRET);

    try {
      await authService.sendVerificationEmail(email, token, c.env.RESEND_API_KEY, c.env.BASE_URL);

      // 儲存到 KV 暫存區，TTL 設 10 分鐘（600 秒）
      await kv.put(pendingKey, JSON.stringify({
        id,
        name,
        phone,
        email,
        passwordHash: hash
      }), { expirationTtl: 600 });

      return c.json({ message: '驗證郵件已寄出，請在 10 分鐘內完成驗證' }, 200);
    } catch (err) {
      return c.json({ error: '驗證郵件寄送失敗', details: err instanceof Error ? err.message : '未知錯誤' }, 500);
    }

  } catch (error) {
    return c.json({ error: '發生錯誤', details: error instanceof Error ? error.message : '未知錯誤' }, 500);
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
    sameSite: 'none',
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
  
  // Add token to blacklist
  await c.env.TOKEN_BLACKLIST.put(token, 'revoked', { expirationTtl: 60 * 60 * 24 * 7 }); // 7 days
  
  deleteCookie(c, 'auth_token', {
    httpOnly: true,
    secure: true,
    path: '/',
    domain: 'api.xincheng-brunch.com',
    sameSite: 'none'
  });
  return c.json({ message: '已登出' });
};

// 驗證 Email
export const verifyEmail = async (c: Context) => {
  const db = getDB(c);
  const kv = c.env.AUTH_KV as KVNamespace;
  const { token } = await c.req.json();

  try {
    const payload = await authService.verifyToken(token, c.env.JWT_SECRET);
    const userId = payload.userId as string;
    const email = payload.email as string;

    // 從 KV 獲取暫存的用戶資料
    const pendingKey = `pending:${email}`;
    const pendingData = await kv.get(pendingKey);
    
    if (!pendingData) {
      return c.json({ error: '找不到待驗證的用戶資料' }, 400);
    }

    const userData = JSON.parse(pendingData);

    // 創建用戶到 D1 資料庫
    await authService.createUser(
      db,
      userData.id,
      userData.name,
      userData.phone,
      userData.email,
      userData.passwordHash
    );

    // 更新驗證狀態
    await authService.updateUserVerificationStatus(db, userId);

    // 刪除 KV 中的暫存資料
    await kv.delete(pendingKey);

    return c.json({ message: '電子郵件驗證成功' });
  } catch (error) {
    return c.json({ 
      error: '驗證失敗', 
      details: error instanceof Error ? error.message : '未知錯誤' 
    }, 400);
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
