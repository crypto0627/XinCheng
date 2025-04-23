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
      return c.json({ error: 'Missing user ID' }, 400);
    }
    
    // Get the current user data
    const existingUser = await db.select().from(users).where(eq(users.id, id)).get();
    
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
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
        
    return c.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
};

export const deleteUSer = async (c: Context) => {
  try {
    const db = getDB(c);
    const { id } = await c.req.json();
    
    if (!id) {
      return c.json({ error: 'Missing user ID' }, 400);
    }
    
    const existingUser = await db.select().from(users).where(eq(users.id, id)).get();
    
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    await db.delete(users).where(eq(users.id, id));
    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
};
