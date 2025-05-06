import { Context, Next } from 'hono';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error in request:', error);
    
    if (error instanceof Error) {
      const status = error.message.includes('not found') ? 404 : 500;
      return c.json({ error: error.message }, status);
    }
    
    return c.json({ error: 'Internal server error' }, 500);
  }
}; 