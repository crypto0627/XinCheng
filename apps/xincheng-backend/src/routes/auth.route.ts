import { Context, Hono } from 'hono';
import {
  register,
  login,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/auth.controller';
import { apiKeyAuth, jwtAuthMiddleware } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'hono/jwt';
import { setCookie, getCookie } from 'hono/cookie';
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ENV } from '../config/env.config';

const router = new Hono<{ Bindings: ENV }>();

// Public routes
router.post('/register', apiKeyAuth, register);
router.post('/login', apiKeyAuth, login);
router.post('/logout', apiKeyAuth, logout);
router.post('/verify-email', apiKeyAuth, verifyEmail);
router.post('/request-password-reset', apiKeyAuth, requestPasswordReset);
router.post('/reset-password', apiKeyAuth, resetPassword);
router.get('/me', apiKeyAuth, jwtAuthMiddleware, async (c: Context<{ Bindings: ENV }>) => {
  try {
    const db = getDB(c);
    const jwtPayload = c.get('jwtPayload');
    const userId = jwtPayload.userId;

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(rows => rows[0]);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error('Error in /me route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Google OAuth
router.get('/google/login', async (c: Context<{ Bindings: ENV }>) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${c.env.API_URL}/api/auth/google/callback`;
  const scope = ['openid', 'email', 'profile'].join(' ');
  const state = uuidv4();

  // Store state in cookie to prevent CSRF
  setCookie(c, 'oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'None', // 允許跨站點請求
    maxAge: 60 * 60 * 24 * 7,
  });

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');

  return c.redirect(url.toString());
});

router.get('/google/callback', async (c: Context<{ Bindings: ENV }>) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const savedState = getCookie(c, 'oauth_state');

  console.log('Callback received:', {
    code: code ? 'present' : 'missing',
    state,
    savedState,
    cookies: c.req.header('cookie'),
  });

  if (!code || !state || !savedState || state !== savedState) {
    console.error('Invalid state or missing code:', { 
      code: code ? 'present' : 'missing',
      state,
      savedState,
      cookies: c.req.header('cookie'),
    });
    return c.text('Invalid state or missing code', 400);
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${c.env.API_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.json();
      console.error('Token error:', error);
      return c.text('Failed to get access token', 400);
    }

    const tokenData = await tokenRes.json() as { access_token: string };
    const { access_token } = tokenData;

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      const error = await userRes.json();
      console.error('User info error:', error);
      return c.text('Failed to get user info', 400);
    }

    const user = await userRes.json() as { email: string, name: string, sub: string };

    // Create or update user
    const db = getDB(c);
    const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1).then(rows => rows[0]);

    let userId: string;
    if (!existingUser) {
      userId = uuidv4();
      await db.insert(users).values({
        id: userId,
        name: user.name,
        phone: '', // Required field in schema
        email: user.email,
        address: '', // Required field in schema
        passwordHash: '',
        isVerified: true,
      });
    } else {
      userId = existingUser.id;
    }

    // Generate JWT Token
    const jwt = await sign(
      {
        userId,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      },
      c.env.JWT_SECRET,
      'HS256'
    );

    console.log('Setting auth_token cookie:', {
      jwt: jwt ? 'present' : 'missing',
      userId,
      email: user.email
    });

    // 在正式環境中設置 cookie
    setCookie(c, 'auth_token', jwt, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None', // 允許跨站點重定向
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain: new URL(c.env.BASE_URL).hostname, // 明確設置 cookie 的域名
    });

    // Clear the oauth_state cookie as it's no longer needed
    setCookie(c, 'oauth_state', '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 0,
      domain: new URL(c.env.BASE_URL).hostname,
    });

    // 添加額外的調試信息
    console.log('Cookies after setting:', c.req.header('set-cookie'));
    console.log('Redirect URL:', `${c.env.BASE_URL}/main`);
    console.log('Domain used for cookies:', new URL(c.env.BASE_URL).hostname);

    // Redirect to frontend
    return c.redirect(`${c.env.BASE_URL}/main`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return c.text('Internal server error', 500);
  }
});

export default router;
