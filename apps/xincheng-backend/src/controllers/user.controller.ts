import { Context } from 'hono'
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as authService from '../services/auth.service';

export const deleteUser = async (c: Context) => {
    try {
        const db = getDB(c);
        const { id } = await c.req.json();
        
        if (!id) {
            return c.json({ error: '缺少用戶ID' }, 400);
        }
        
        await db.delete(users).where(eq(users.id, id));
        return c.json({ message: '用戶已刪除' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return c.json({ error: '刪除用戶失敗' }, 500);
    }
};

export const updateUser = async (c: Context) => {
  try {
    const db = getDB(c);
    const { id, passwordHash, name, email, address } = await c.req.json();
    
    if (!id) {
      return c.json({ error: '缺少用戶ID' }, 400);
    }
    
    const updateData: Record<string, string> = {};
    
    // Hash the password if provided
    if (passwordHash) {
      updateData.passwordHash = await authService.hashPassword(passwordHash);
    }
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = address;

    if (Object.keys(updateData).length === 0) {
      return c.json({ error: '沒有有效的欄位可更新' }, 400);
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id));
        
    return c.json({ message: '用戶更新成功' });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: '更新用戶失敗' }, 500);
  }
};
