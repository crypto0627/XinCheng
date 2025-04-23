import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: ['https://www.xincheng-brunch.com', 'https://www.managerment.xincheng-brunch.com'],
  allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  maxAge: 600,
})
