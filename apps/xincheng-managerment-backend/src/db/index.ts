import { drizzle } from 'drizzle-orm/d1';
import type { Context } from 'hono';

export const getDB = (c: Context) => {
  return drizzle(c.env.DB);
};