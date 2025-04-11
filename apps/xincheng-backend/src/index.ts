import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { nanoid } from 'nanoid'
import { Resend } from 'resend'
import { apiKeyAuth } from './middleware/auth'
import { Order } from './types'
import { ENV } from './config/env.config'
import { corsMiddleware } from './middleware/cors'
import { errorMiddleware } from './middleware/error'
import authRoutes from './routes/auth.route'
import { drizzle } from 'drizzle-orm/d1';
import { users } from './db/schema'
import userRoutes from './routes/user.route'

const app = new Hono<{ Bindings: ENV }>()

app.use('*', corsMiddleware)
app.use('*', errorMiddleware)
app.use(csrf({ origin: ['https://www.xincheng.jakekuo.com', 'http://localhost:3000'] }))
app.route('/api/auth', authRoutes)
app.route('/api/user', userRoutes)

app.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.json({ message: 'Hello World', result })
})

export default app
