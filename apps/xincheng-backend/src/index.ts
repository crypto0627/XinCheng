import { Hono } from 'hono'
import { Bindings } from 'hono/types'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Resend } from 'resend'
import { securityMiddleware } from './config/security'
import { apiKeyAuth } from './middleware/auth'
import { getProducts, products } from './services/product'
// eslint-disable-next-line import/no-extraneous-dependencies
import { nanoid } from 'nanoid'
import { Order } from './types'

interface ENV extends Bindings {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ORDERS: KVNamespace
  // eslint-disable-next-line @typescript-eslint/naming-convention
  RESEND_API_KEY: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const app = new Hono<{ Bindings: ENV }>()

app.use('*', ...securityMiddleware)
app.use('*', apiKeyAuth)

// 獲取所有商品
app.get('/api/products', (c) => {
  return c.json(getProducts())
})

// 提交訂單
app.post('/api/orders', async (c) => {
  const body = await c.req.json()
  const orderId = nanoid()
  const now = new Date().toISOString()
  
  const newOrder: Order = {
    ...body,
    id: orderId,
    createdAt: now,
    updatedAt: now,
  }

  await c.env.ORDERS.put(`order:${orderId}`, JSON.stringify(newOrder))

  // 準備郵件內容
  const orderDetails = body.items.map((item: { productId: number; quantity: number }) => {
    const product = products.find(p => p.id === item.productId)
    return `${product?.name} x ${item.quantity} = NT$${(product?.price || 0) * item.quantity}`
  }).join('\n')

  const emailBody = `
親愛的 ${body.name} 您好,

感謝您的訂購！以下是您的訂單詳情：

訂單編號: ${orderId}
訂購時間: ${now}

訂購商品:
${orderDetails}

總金額: NT$${body.items.reduce((total: number, item: { productId: number; quantity: number }) => {
  const product = products.find(p => p.id === item.productId)
  return total + (product?.price || 0) * item.quantity
}, 0)}

配送地址: ${body.address}
付款方式: ${body.paymentMethod}

如有任何問題，請隨時與我們聯繫。

祝您購物愉快！
`

  // 使用 Resend API 發送郵件
  try {
    const resend = new Resend(c.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: '星橙輕食餐盒 <xincheng@jakekuo.com>',
      to: body.email,
      subject: `訂單已確認 #${orderId}`,
      text: emailBody,
    })
    if (error) {
      return c.json(error, 400)
    }
    
    console.log(`訂單確認郵件已發送至 ${body.email}`)
    return c.json(data)
  } catch (error) {
    console.error('發送郵件時發生錯誤:', error)
  }

  return c.json({ message: '訂單已成功送出', orderId: newOrder.id })
})

export default app
