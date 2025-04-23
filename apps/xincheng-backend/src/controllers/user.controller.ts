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
            return c.json({ error: 'Missing user ID' }, 400);
        }
        
        await db.delete(users).where(eq(users.id, id));
        return c.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return c.json({ error: 'Failed to delete user' }, 500);
    }
};

export const getUser = async (c: Context) => {
  const db = getDB(c);
  const { id } = await c.req.json();
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1).then(rows => rows[0]);
  return c.json({ user });
};

export const updateUser = async (c: Context) => {
  try {
    const db = getDB(c);
    const { id, passwordHash, name, email, address } = await c.req.json();
    
    if (!id) {
      return c.json({ error: 'Missing user ID' }, 400);
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
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id));
        
    return c.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
};
