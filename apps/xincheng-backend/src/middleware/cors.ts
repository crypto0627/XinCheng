import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: ['https://www.xincheng.jakekuo.com', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-User-Id'],
  maxAge: 600,
})
