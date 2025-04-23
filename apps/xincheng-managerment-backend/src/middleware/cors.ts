import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: ['https://www.xincheng-brunch-managerment.com'],
  allowMethods: ['GET', 'POST'],
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  maxAge: 600,
})
