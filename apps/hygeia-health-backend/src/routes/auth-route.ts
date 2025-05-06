import { Context, Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'hono/jwt';
import { setCookie, getCookie } from 'hono/cookie';
import { getDB } from '../db';
import { users, authenticators } from '../db/schema';
import { eq } from 'drizzle-orm';
import { apiKeyAuth, jwtAuthMiddleware } from '../middleware/auth';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { verifyAuthenticationResponse } from '../../node_modules/@simplewebauthn/server/script/authentication/verifyAuthenticationResponse';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { AuthenticatorTransport } from '@simplewebauthn/types';

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.get('/me', apiKeyAuth, jwtAuthMiddleware, async (c: Context<{Bindings: CloudflareBindings}>) => {
  try {
    const db = getDB(c)
    const jwtPayload = c.get('jwtPayload')
    const userId = jwtPayload.userId
    if (!userId) {
      return c.json({ error: 'User not found' }, 404)
    }
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(rows => rows[0])

    if (!user) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user)
  } catch (error) {
    return c.json({ error: 'getUser router is not working!' }, 500)
  }
})

router.get('/google/login', apiKeyAuth, async (c: Context<{ Bindings: CloudflareBindings }>) => {
    const clientId = c.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${c.env.API_URL}/api/auth/google/callback`;
    const scope = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/contacts.readonly'].join(' ');
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
  
  router.get('/google/callback', apiKeyAuth, async (c: Context<{ Bindings: CloudflareBindings }>) => {
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
          email: user.email,
          loginType: 'google'
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
  
      // 在正式環境中設置 cookie
      setCookie(c, 'auth_token', jwt, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None', // 允許跨站點重定向
        maxAge: 60 * 60 * 24 * 7, // 7 days
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
  
      // Redirect to frontend callback page
      return c.redirect(`${c.env.BASE_URL}/auth/google/callback`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return c.text('Internal server error', 500);
    }
  });

  router.post('/webauthn/register/options', apiKeyAuth, async (c) => {
    try {
      const body = await c.req.json();
      const userId = uuidv4();
      // Create a proper Uint8Array from random bytes
      const challenge = isoBase64URL.fromBuffer(crypto.getRandomValues(new Uint8Array(32)));

      const options = {
        challenge: challenge,
        rp: {
          name: 'hygeia-health',
          id: new URL(c.env.TEST_BASE_URL).hostname,
        },
        user: {
          id: userId,
          name: body.name,
          displayName: body.name,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        timeout: 60000,
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
          authenticatorAttachment: 'platform',
        },
        attestation: 'direct',
      };
      // 儲存用戶資訊和 challenge
      await c.env.webauthn_kv.put(`register:${userId}`, JSON.stringify({
        id: userId,
        name: body.name,
        email: body.email,
        loginType: 'passkey',
        currentChallenge: challenge
      }), {expirationTtl: 300});

      return c.json(options, 200);
    } catch (error) {
      console.error('WebAuthn registration options error:', error);
      return c.json({ error: 'Failed to generate registration options' }, 500);
    }
  });

  router.post('/webauthn/register/verify', apiKeyAuth, async (c) => {
    try {
      const body = await c.req.json();
      const db = getDB(c);
      // 解析 userId 並轉換成 Base64 後解碼
      const decodeUserId = isoBase64URL.fromBuffer(body.userId.data);
  
      // 從 KV 中獲取用戶資料
      const userData = await c.env.webauthn_kv.get(`register:${decodeUserId}`);
      if (!userData) {
        return c.json({ error: 'Registration data not found' }, 404);
      }
  
      const user = JSON.parse(userData);
      if (!user.currentChallenge) {
        return c.json({ error: 'No registration challenge found' }, 400);
      }
  
      // 進行 WebAuthn 註冊回應驗證
      const credential = {
        id: body.credential.id,
        rawId: body.credential.rawId,
        type: body.credential.type,
        response: {
          attestationObject: body.credential.response.attestationObject,
          clientDataJSON: body.credential.response.clientDataJSON,
        },
      };
  
      // 驗證註冊回應
      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: c.env.TEST_BASE_URL,
        expectedRPID: new URL(c.env.TEST_BASE_URL).hostname,
        requireUserVerification: true,
      });
  
      if (!verification.verified || !verification.registrationInfo) {
        return c.json({ error: 'Verification failed' }, 400);
      }
      const safeCounter = typeof verification.registrationInfo.credential?.counter === 'number' ? verification.registrationInfo.credential.counter : 0;
      // 創建用戶並儲存資料
      await db.insert(users).values({
        id: user.id,
        name: user.name,
        email: user.email,
        loginType: user.loginType
      });
      if(!verification.registrationInfo.credential) {
        return c.json({ error: 'Verify credential failed' }, 401);
      }
      // 儲存 authenticator 資訊
      await db.insert(authenticators).values({
        id: uuidv4(),
        credentialID: String(verification.registrationInfo.credential?.id),
        credentialPublicKey: isoBase64URL.fromBuffer(verification.registrationInfo.credential.publicKey),
        counter: safeCounter,
        userId: user.id
      });
      // 刪除臨時註冊資料
      await c.env.webauthn_kv.delete(`register:${user.id}`);
  
      // 生成 JWT Token
      const jwt = await sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        },
        c.env.JWT_SECRET,
        'HS256'
      );
  
      // 設置 Cookie
      setCookie(c, 'auth_token', jwt, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
  
      return c.json({ verified: true });
    } catch (error) {
      console.error('WebAuthn registration verification error:', error);
      return c.json({ error: 'Failed to verify registration' }, 500);
    }
  });

  router.post('/webauthn/login/options', apiKeyAuth, async (c) => {
    try {
      const body = await c.req.json();
      const email = body.email;
      const db = getDB(c);
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      const userId = user.id;
      const creds = await db.select().from(authenticators).where(eq(authenticators.userId, userId)).limit(1).then(rows => rows[0]);
      const credentialId = creds.credentialID;

      // 生成 login challenge
      const challenge = isoBase64URL.fromBuffer(crypto.getRandomValues(new Uint8Array(32)));
  
      // 設置登入選項
      const options = {
        challenge: challenge,
        rpId: new URL(c.env.TEST_BASE_URL).hostname,
        userId,
        allowCredentials: [
          {
            type: 'public-key',
            id: credentialId,
          },
        ],
        timeout: 60000,
        userVerification: 'preferred',
      };
  
      // 儲存 challenge
      await c.env.webauthn_kv.put(`login:${userId}`, JSON.stringify({ challenge }), { expirationTtl: 300 });
  
      return c.json(options, 200);
    } catch (error) {
      console.error('WebAuthn login options error:', error);
      return c.json({ error: 'Failed to generate login options' }, 500);
    }
  });

  router.post('/webauthn/login/verify', apiKeyAuth, async (c) => {
    try {
      const body = await c.req.json();
      const db = getDB(c);
  
      // 解析 userId 並轉換成 Base64
      const userId = body.userId; // 用戶 ID 由前端傳來
      const credential = body.credential; // 用戶的 credential 資料
  
      // 從 KV 中獲取該用戶的 challenge
      const storedChallengeData = await c.env.webauthn_kv.get(`login:${userId}`);
      if (!storedChallengeData) {
        return c.json({ error: 'Login challenge not found' }, 400);
      }
      const storedChallenge = JSON.parse(storedChallengeData).challenge;
      
      // 從 authenticator db中獲取user publickey
      const authenticator = await db.select().from(authenticators).where(eq(authenticators.userId, userId)).limit(1).then(rows => rows[0]);
      if (!authenticator) {
        return c.json({ error: 'Authenticator not found' }, 400);
      }

      // 驗證登入回應
      const verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge: storedChallenge,
        expectedOrigin: c.env.TEST_BASE_URL,
        expectedRPID: new URL(c.env.TEST_BASE_URL).hostname,
        credential: {
          id: credential.id,
          publicKey: isoBase64URL.toBuffer(authenticator.credentialPublicKey),
          counter: authenticator.counter,
          transports: (authenticator.transports || []) as AuthenticatorTransport[]
        },
        requireUserVerification: true,
      });
  
      if (!verification.verified || !verification.authenticationInfo) {
        return c.json({ error: 'Login verification failed' }, 400);
      }
 
      // 登入成功，更新 credential counter 等資訊
      await db.update(authenticators)
        .set({ counter: verification.authenticationInfo.newCounter })
        .where(eq(authenticators.credentialID, String(verification.authenticationInfo.credentialID)));
     
      // 刪除KV
      await c.env.webauthn_kv.delete(`login:${userId}`);
      console.log('404 line: ', userId);
      // 生成 JWT Token
      const jwt = await sign(
        {
          userId: userId,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        },
        c.env.JWT_SECRET,
        'HS256'
      );
  
      // 設置 Cookie
      setCookie(c, 'auth_token', jwt, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
  
      return c.json({ verified: true });
    } catch (error) {
      console.error('WebAuthn login verification error:', error);
      return c.json({ error: 'Failed to verify login' }, 500);
    }
  });  

export default router