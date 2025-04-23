import { Context } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { sign, verify } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ENV } from '../config/env.config';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

/**
 * Register a new user
 */
export const register = async (c: Context<{ Bindings: ENV }>) => {
  try {
    const { name, email, password, role } = await c.req.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const db = getDB(c);

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    await db.insert(users).values({
      id: userId,
      name,
      email,
      passwordHash,
      role,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Generate verification token
    const verificationToken = await sign(
      {
        userId,
        email,
        type: 'email_verification',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
      },
      c.env.JWT_SECRET,
      'HS256'
    );

    // Send verification email
    const resend = new Resend(c.env.RESEND_API_KEY);
    const verificationUrl = `${c.env.BASE_URL}/verify-email?token=${verificationToken}`;
    
    await resend.emails.send({
      from: 'xincheng@jakekuo.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Our Platform</h1>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email Address</a></p>
        <p>This link will expire in 24 hours.</p>
      `
    });

    return c.json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      userId
    }, 201);
  } catch (error) {
    console.error('Error in register:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (c: Context<{ Bindings: ENV }>) => {
  try {
    const { token } = await c.req.query();
    
    if (!token) {
      return c.json({ error: 'Verification token is required' }, 400);
    }

    // Verify token
    let payload;
    try {
      payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    } catch (error) {
      return c.json({ error: 'Invalid or expired verification token' }, 401);
    }

    if (payload.type !== 'email_verification') {
      return c.json({ error: 'Invalid token type' }, 401);
    }

    const db = getDB(c);

    // Update user verification status
    await db
      .update(users)
      .set({ 
        isVerified: true,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, payload.userId as string));

    return c.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (c: Context<{ Bindings: ENV }>) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const db = getDB(c);

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (user.isVerified) {
      return c.json({ error: 'Email is already verified' }, 400);
    }

    // Generate verification token
    const verificationToken = await sign(
      {
        userId: user.id,
        email: user.email,
        type: 'email_verification',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
      },
      c.env.JWT_SECRET,
      'HS256'
    );

    // Send verification email
    const resend = new Resend(c.env.RESEND_API_KEY);
    const verificationUrl = `${c.env.BASE_URL}/verify-email?token=${verificationToken}`;
    
    await resend.emails.send({
      from: 'xincheng@jakekuo.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Our Platform</h1>
        <p>Hi ${user.name},</p>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email Address</a></p>
        <p>This link will expire in 24 hours.</p>
      `
    });

    return c.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in resendVerification:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Login user
 */
export const login = async (c: Context<{ Bindings: ENV }>) => {
  try {
    const { email, password } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const db = getDB(c);

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
    if (!user) {
      return c.json({ error: 'Can not find user.Please register account!' }, 401);
    }

    // Check if user is verified
    if (!user.isVerified) {
      return c.json({ error: 'Please verify your email before logging in', needsVerification: true }, 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return c.json({ error: 'Error password' }, 401);
    }

    // Generate JWT token
    const token = await sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
      },
      c.env.JWT_SECRET,
      'HS256'
    );

    // Set cookie
    setCookie(c, 'auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (c: Context<{ Bindings: ENV }>) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const db = getDB(c);

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return c.json({ message: 'If your email is registered, you will receive a password reset link' });
    }

    // Generate reset token
    const resetToken = await sign(
      {
        userId: user.id,
        email: user.email,
        type: 'password_reset',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
      },
      c.env.JWT_SECRET,
      'HS256'
    );

    // Send reset email
    const resend = new Resend(c.env.RESEND_API_KEY);
    const resetUrl = `${c.env.BASE_URL}/reset-password?token=${resetToken}`;
    
    await resend.emails.send({
      from: 'xincheng@jakekuo.com',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    return c.json({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Reset password
 */
export const resetPassword = async (c: Context<{ Bindings: ENV }>) => {
  try {
    const { token, newPassword } = await c.req.json();

    if (!token || !newPassword) {
      return c.json({ error: 'Token and new password are required' }, 400);
    }

    // Verify token
    let payload;
    try {
      payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    } catch (error) {
      return c.json({ error: 'Invalid or expired reset token' }, 401);
    }

    if (payload.type !== 'password_reset') {
      return c.json({ error: 'Invalid token type' }, 401);
    }

    const db = getDB(c);

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db
      .update(users)
      .set({ 
        passwordHash,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, payload.userId as string));

    return c.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Logout user
 */
export const logout = async (c: Context<{ Bindings: ENV }>) => {
  try {
    // Clear auth cookie
    setCookie(c, 'auth_token', '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 0 // Expire immediately
    });

    return c.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
