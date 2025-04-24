import { sign, verify } from 'hono/jwt';
import { eq, and, gt } from 'drizzle-orm';
import { users, passwordResetTokens } from '../db/schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { DrizzleInstance } from '../types';

export const validateRegistrationData = (
  name: string, 
  phone: string, 
  email: string, 
  address: string, 
  password: string
) => {
  if (!name || !phone || !email || !address || !password) {
    return { valid: false, error: 'Missing required fields' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }

  return { valid: true };
};

export const checkExistingUser = async (db: DrizzleInstance, email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((rows: any[]) => rows[0]);
};

export const createUser = async (
  db: DrizzleInstance,
  id: string,
  name: string,
  phone: string,
  email: string,
  address: string,
  passwordHash: string
) => {
  await db.insert(users).values({
    id,
    name,
    phone,
    email,
    address,
    passwordHash,
    isVerified: false
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  resendApiKey: string,
  baseUrl: string
) => {
  const resend = new Resend(resendApiKey);
  
  await resend.emails.send({
    from: 'mail-service-manager@xincheng-brunch.com',
    to: email,
    subject: 'Verify your email',
    html: `
      <div style="background: #FF6B35; padding: 20px; color: white; font-family: Arial, sans-serif;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h1 style="color: #FF6B35;">Welcome to XinCheng!</h1>
          <p style="color: #333;">Please verify your email:</p>
          <a href="${baseUrl}/verify-email?token=${token}" 
             style="display: inline-block; padding: 10px 20px; background: #FF6B35; color: white; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </div>
      </div>
    `
  });
};

export const generateToken = async (payload: any, secret: string) => {
  return await sign(payload, secret, 'HS256');
};

export const verifyToken = async (token: string, secret: string) => {
  return await verify(token, secret);
};

export const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const createPasswordResetToken = async (db: DrizzleInstance, userId: string) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  await db.insert(passwordResetTokens).values({
    id: uuidv4(),
    userId,
    token,
    expiresAt: expiresAt.toISOString()
  });
  
  return token;
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  resendApiKey: string,
  baseUrl: string
) => {
  const resend = new Resend(resendApiKey);
  
  await resend.emails.send({
    from: 'mail-service-manager@xincheng-brunch.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <div style="background: #FF6B35; padding: 20px; color: white; font-family: Arial, sans-serif;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <p style="color: #333;">Click below to reset password (expires in 1 hour):</p>
          <a href="${baseUrl}/reset-password?token=${token}" 
             style="display: inline-block; padding: 10px 20px; background: #FF6B35; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
      </div>
    `
  });
};

export const getPasswordResetToken = async (db: DrizzleInstance, token: string) => {
  const now = Math.floor(Date.now() / 1000);
  
  return await db.select()
    .from(passwordResetTokens)
    .where(and(
      eq(passwordResetTokens.token, token), 
      gt(passwordResetTokens.expiresAt, new Date(now * 1000).toISOString())
    ))
    .limit(1)
    .then((rows: any[]) => rows[0]);
};

export const updatePassword = async (db: DrizzleInstance, userId: string, tokenId: string, hash: string) => {
  await db.transaction(async (tx: any) => {
    await tx.update(users).set({ passwordHash: hash }).where(eq(users.id, userId));
    await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, tokenId));
  });
};

export const updateUserVerificationStatus = async (db: DrizzleInstance, userId: string) => {
  await db.update(users).set({ isVerified: true }).where(eq(users.id, userId));
}; 