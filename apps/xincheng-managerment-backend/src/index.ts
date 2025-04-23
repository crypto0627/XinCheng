import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { ENV } from './config/env.config'
import { corsMiddleware } from './middleware/cors'
import { errorMiddleware } from './middleware/error'
import { drizzle } from 'drizzle-orm/d1';
import { users } from './db/schema'
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route'

const app = new Hono<{ Bindings: ENV }>()

app.use('*', corsMiddleware)
app.use('*', errorMiddleware)
app.use(csrf({ origin: ['https://www.xincheng-managerment.jakekuo.com', 'http://localhost:3000'] }))

app.route('/api/auth', authRoute)
app.route('/api/user', userRoute)

app.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.json({ message: 'Hello World', result })
})

export default app