import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

export const securityMiddleware = [
  cors({
    origin: ['*'],
    credentials: true,
  }),
  secureHeaders(),
]