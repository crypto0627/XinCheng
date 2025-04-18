import { Context } from 'hono'
import { getDB } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteUser = async (c: Context) => {
    const db = getDB(c);
    const { id } = await c.req.json();
    await db.delete(users).where(eq(users.id, id));
    return c.json({ message: 'User deleted' });
  };
  
export const getUser = async (c: Context) => {
  const db = getDB(c);
  const { id } = await c.req.json();
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1).then(rows => rows[0]);
  return c.json({ user });
};
