import { Context, Hono } from 'hono';
import {
  register,
  login,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';
import { apiKeyAuth, jwtAuthMiddleware } from '../middleware/auth';
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ENV } from '../config/env.config';

const router = new Hono<{ Bindings: ENV }>();

// Public routes
router.post('/register', apiKeyAuth, register);
router.post('/login', apiKeyAuth, login);
router.post('/logout', apiKeyAuth, logout);
router.get('/verify-email', apiKeyAuth, verifyEmail);
router.post('/resend-verification', apiKeyAuth, resendVerification);
router.post('/forgot-password', apiKeyAuth, forgotPassword);
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

export default router;
