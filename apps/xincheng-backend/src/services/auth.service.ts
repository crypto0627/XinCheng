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
    return { valid: false, error: '請填寫所有必填欄位' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '電子郵件格式不正確' };
  }

  if (password.length < 6) {
    return { valid: false, error: '密碼長度至少需要6個字元' };
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
    subject: '請驗證您的電子郵件',
    html: `
      <div style="background: #f8f9fa; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: #FF6B35; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">歡迎加入新橙早午餐！</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
              感謝您註冊新成早午餐帳號！請點擊下方按鈕完成電子郵件驗證：
            </p>
            <a href="${baseUrl}/verify-email?token=${token}" 
               style="display: inline-block; padding: 12px 24px; background: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;">
              立即驗證
            </a>
            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
              如果您沒有註冊新成早午餐帳號，請忽略此郵件。
            </p>
          </div>
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
    subject: '重設您的密碼',
    html: `
      <div style="background: #f8f9fa; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: #FF6B35; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">重設密碼</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
              我們收到您重設密碼的請求。請點擊下方按鈕來重設您的密碼（此連結將在1小時後失效）：
            </p>
            <a href="${baseUrl}/reset-password?token=${token}" 
               style="display: inline-block; padding: 12px 24px; background: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;">
              重設密碼
            </a>
            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
              如果您沒有要求重設密碼，請忽略此郵件。
            </p>
          </div>
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