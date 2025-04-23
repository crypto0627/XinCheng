import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { ENV } from './config/env.config'
import { corsMiddleware } from './middleware/cors'
import { errorMiddleware } from './middleware/error'
import { drizzle } from 'drizzle-orm/d1';
import { users } from './db/schema'
import { authRoutes, userRoutes, orderRoutes } from './routes'

const app = new Hono<{ Bindings: ENV }>()

app.use(corsMiddleware)
app.use(errorMiddleware)
app.use(csrf({ origin: ['https://www.xincheng-brunch.com'] }))

app.route('/api/auth', authRoutes)
app.route('/api/user', userRoutes)
app.route('/api/order', orderRoutes)

app.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.json({ message: 'Hello World', result })
})

export default app