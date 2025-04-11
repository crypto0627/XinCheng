import { Context, MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'
import { getCookie } from 'hono/cookie'

const JWT_SECRET = 'secret' // use env

export const jwtAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, 'auth_token') || c.req.header('Authorization')?.replace('Bearer ', '')

  if(!token) return c.json({ error: 'Unauthorized jwt' }, 401)

  try {
    const payload = await verify(token, JWT_SECRET)
    c.set('userId', payload.userId)
    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

export const apiKeyAuth = async (c: Context, next: () => Promise<void>) => {
  const apiKey = c.req.header('X-API-Key')
  if (!apiKey || apiKey !== c.env.X_API_KEY) {
    return c.json({ error: 'Unauthorized api' }, 401)
  }
  await next()
}
