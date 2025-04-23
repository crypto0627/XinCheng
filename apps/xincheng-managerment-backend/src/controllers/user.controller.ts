import { Context } from 'hono'
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const updateUser = async (c: Context) => {
  try {
    const db = getDB(c);
    const { id, name, email, passwordHash, role, isVerified } = await c.req.json();
    
    if (!id) {
      return c.json({ error: '缺少用戶ID' }, 400);
    }
    
    // Get the current user data
    const existingUser = await db.select().from(users).where(eq(users.id, id)).get();
    
    if (!existingUser) {
      return c.json({ error: '找不到用戶' }, 404);
    }
    
    const updateData: Record<string, any> = {};
    
    // Use new values if provided, otherwise keep existing values
    updateData.name = name !== undefined ? name : existingUser.name;
    updateData.email = email !== undefined ? email : existingUser.email;
    updateData.role = role !== undefined ? role : existingUser.role;
    updateData.isVerified = isVerified !== undefined ? isVerified : existingUser.isVerified;
    
    // Hash the password if provided
    if (passwordHash) {
      updateData.passwordHash = await bcrypt.hash(passwordHash, 10);
    }
    
    updateData.updatedAt = new Date().toISOString();

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id));
        
    return c.json({ message: '用戶更新成功' });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: '更新用戶失敗' }, 500);
  }
};

export const deleteUSer = async (c: Context) => {
  try {
    const db = getDB(c);
    const { id } = await c.req.json();
    
    if (!id) {
      return c.json({ error: '缺少用戶ID' }, 400);
    }
    
    const existingUser = await db.select().from(users).where(eq(users.id, id)).get();
    
    if (!existingUser) {
      return c.json({ error: '找不到用戶' }, 404);
    }
    
    await db.delete(users).where(eq(users.id, id));
    return c.json({ message: '用戶刪除成功' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ error: '刪除用戶失敗' }, 500);
  }
};
