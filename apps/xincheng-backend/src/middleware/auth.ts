import { Context } from 'hono'

export const apiKeyAuth = async (c: Context, next: () => Promise<void>) => {
  const apiKey = c.req.header('X-API-Key')
  if (!apiKey || apiKey !== 'your-secret-api-key') {
    return c.json({ message: '未授權的請求' }, 401)
  }
  await next()
}