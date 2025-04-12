import { sign, verify } from 'hono/jwt';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { Context } from 'hono';
import { eq, and, gt } from 'drizzle-orm';
import { users, passwordResetTokens } from '../db/schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../db';
import { Resend } from 'resend';
// 註冊
export const register = async (c: Context) => {
  try {
    const db = getDB(c);
    const { username, email, password } = await c.req.json();

    // 驗證必要字段
    if (!username || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    // 驗證密碼長度
    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters long' }, 400);
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then(rows => rows[0]);
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);

    // 先創建驗證 token，確保可以發送郵件後再創建用戶
    const verificationToken = await sign({ userId: id }, c.env.JWT_SECRET, 'HS256');
    const resend = new Resend(c.env.RESEND_API_KEY);
    
    try {
      // 嘗試發送驗證郵件
      await resend.emails.send({
        from: 'xincheng@jakekuo.com',
        to: email,
        subject: 'Verify your email',
        html: `
          <h1>Welcome to XinCheng!</h1>
          <p>Please verify your email:</p>
          <a href="${c.env.TEST_BASE_URL}/verify-email?token=${verificationToken}">Verify Email</a>
        `
      });
      
      // 郵件發送成功後，再創建用戶
      await db.insert(users).values({
        id,
        username,
        email,
        passwordHash: hash,
        isVerified: false
      });
      
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

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
  if (!user) return c.json({ error: 'Can not find user' }, 401);
  if (!user.isVerified) return c.json({ error: 'Email not verified, please verify your email' }, 401);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return c.json({ error: 'Password is incorrect, please try again' }, 401);

  const token = await sign({
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  }, c.env.JWT_SECRET, 'HS256');

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
      username: user.username
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
    const payload = await verify(token, c.env.JWT_SECRET);
    await db.update(users).set({ isVerified: true }).where(eq(users.id, payload.userId as string));
    return c.json({ message: 'Email verified successfully' });
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 400);
  }
};

// 發送密碼重設信
export const requestPasswordReset = async (c: Context) => {
  const db = getDB(c);
  const { email } = await c.req.json();

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
  if (!user) {
    return c.json({ message: 'If account exists, reset email sent' });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  await db.insert(passwordResetTokens).values({
    id: uuidv4(),
    userId: user.id,
    token,
    expiresAt: expiresAt.toISOString()
  });

  const resend = new Resend(c.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'xincheng@jakekuo.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <p>Click below to reset password (expires in 1 hour):</p>
      <a href="${c.env.TEST_BASE_URL}/reset-password?token=${token}">Reset</a>
    `
  });

  return c.json({ message: 'Password reset email sent' });
};

// 密碼重設
export const resetPassword = async (c: Context) => {
  const db = getDB(c);
  const { token, newPassword } = await c.req.json();

  const now = Math.floor(Date.now() / 1000);
  const resetToken = await db.select()
    .from(passwordResetTokens)
    .where(and(
      eq(passwordResetTokens.token, token), 
      gt(passwordResetTokens.expiresAt, new Date(now * 1000).toISOString())
    ))
    .limit(1)
    .then(rows => rows[0]);

  if (!resetToken) return c.json({ error: 'Invalid or expired token' }, 400);

  const hash = await bcrypt.hash(newPassword, 10);

  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash: hash }).where(eq(users.id, resetToken.userId));
    await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id));
  });

  return c.json({ message: 'Password reset successful' });
};
