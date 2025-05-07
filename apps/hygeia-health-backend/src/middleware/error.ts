import { MiddlewareHandler } from 'hono';

export const errorMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err: any) {
    console.error('Unhandled Error:', err);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
  }
};