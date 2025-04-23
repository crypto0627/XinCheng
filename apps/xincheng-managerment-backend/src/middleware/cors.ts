import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: ['https://www.managerment.xincheng-brunch.com'],
  allowMethods: ['GET', 'POST'],
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  maxAge: 600,
})
