import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { Bindings } from 'hono/types'
import { nanoid } from 'nanoid'
import { Resend } from 'resend'
import { apiKeyAuth } from './middleware/auth'
import { Order } from './types'

interface ENV extends Bindings {
  ORDERS: KVNamespace
  RESEND_API_KEY: string
  X_API_KEY: string
}

const app = new Hono<{ Bindings: ENV }>()

app.use('/api/*', cors({
  origin: ['https://www.xincheng.jakekuo.com', 'http://localhost:3001', 'https://xincheng-manager.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key', 'X-CSRF-Token', 'Authorization'],
  maxAge: 600,
  credentials: true,
}))
app.use('*', apiKeyAuth)
app.use(csrf({origin: ['https://www.xincheng.jakekuo.com', 'http://localhost:3001', 'https://xincheng-8i1.pages.dev/']}))
// 計算總金額
const calculateTotalPrice = (items: { price: number; quantity: number }[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

// 提交訂單
app.post('/api/orders', async (c) => {
  const body = await c.req.json()
  const orderId = nanoid()
  const now = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // 計算總金額
  const totalPrice = calculateTotalPrice(body.items)

  const newOrder: Order = {
    ...body,
    id: orderId,
    orderStatus: 'pending',
    totalPrice,
    createdAt: now,
    updatedAt: now,
  }

  try {
    // 儲存訂單到 KV
    await c.env.ORDERS.put(`order:${orderId}`, JSON.stringify(newOrder))
  
    // 準備郵件內容
    const orderDetails = body.items.map((item: { name: string; quantity: number; price: number }) => {
      return `🍱 ${item.name} x ${item.quantity} = NT$${item.price * item.quantity}`
    }).join('<br>')  // 使用 <br> 換行
  
    const emailBody = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center;">
        <img src="https://raw.githubusercontent.com/crypto0627/XinCheng/refs/heads/main/apps/frontend/public/logo.png" alt="星橙輕食餐盒 Logo" style="width: 200px; height: auto; margin-bottom: 20px;">
      </div>
      <h1 style="color: #FF9900;">星橙輕食餐盒 XINCHENG</h1>
      <hr>
      <p>親愛的 ${body.name} 您好,</p>
      <p>☀️ 感謝您選擇星橙輕食餐盒！我們已收到您的訂單，以下是您的訂單詳情：</p>
      
      <p>📅 <strong>訂購時間:</strong> ${now}</p>
      <p>🔖 <strong>訂單編號:</strong> #${orderId}</p>
  
      <h3>【訂購商品明細】</h3>
      <p>${orderDetails}</p>
  
      <p>💰 <strong>總金額:</strong> NT$${totalPrice}</p>
  
      <p>💳 <strong>付款方式:</strong> ${body.paymentMethod}</p>
  
      <p>✨ 我們將用心準備您的餐點。如有任何問題，歡迎隨時與我們聯繫！</p>
      
      <hr>
      <footer>
        <p>─────────────────────────</p>
        <p>🌟 星橙輕食餐盒 敬上</p>
        <p>📞 客服專線: 0905853711</p>
        <p>🌐 官方網站: <a href="https://xincheng.jakekuo.com" target="_blank">xincheng.jakekuo.com</a></p>
      </footer>
    </div>
    `
    // 使用 Resend API 發送 HTML 郵件
    const resend = new Resend(c.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: '星橙輕食餐盒 <xincheng@jakekuo.com>',
      to: body.email,
      subject: `🍊 星橙輕食餐盒 - 訂單確認 #${orderId}`,
      html: emailBody,  // 改為 html
    })
  
    if (error) {
      return c.json(error, 400)
    }
  
    return c.json({ message: '訂單已成功送出', orderId: newOrder.id })
  
  } catch (error) {
    console.error('處理訂單時發生錯誤:', error)
    return c.json({ message: '訂單處理過程中出現問題，請稍後再試。' }, 500)
  }  
})

// 獲取所有訂單
app.get('/api/orders', async (c) => {
  try {
    const { keys } = await c.env.ORDERS.list({ prefix: 'order:' })
    const orders = await Promise.all(
      keys.map(async (key) => {
        const order = await c.env.ORDERS.get(key.name)
        return order ? JSON.parse(order) : null
      }),
    )
    return c.json(orders.filter(Boolean))
  } catch (error) {
    console.error('獲取訂單時發生錯誤:', error)
    return c.json({ message: '獲取訂單時出現問題，請稍後再試。' }, 500)
  }
})

// 刪除訂單
app.delete('/api/orders/:id', async (c) => {
  const orderId = c.req.param('id')
  try {
    await c.env.ORDERS.delete(`order:${orderId}`)
    return c.json({ message: '訂單已成功刪除' })
  } catch (error) {
    console.error('刪除訂單時發生錯誤:', error)
    return c.json({ message: '刪除訂單時出現問題，請稍後再試。' }, 500)
  }
})

// 更新訂單
app.put('/api/orders/:id', async (c) => {
  const orderId = c.req.param('id')
  const body = await c.req.json()

  try {
    const existingOrderStr = await c.env.ORDERS.get(`order:${orderId}`)
    if (!existingOrderStr) {
      return c.json({ message: '找不到該訂單' }, 404)
    }

    const existingOrder = JSON.parse(existingOrderStr)

    // 計算更新後的總金額
    const totalPrice = calculateTotalPrice(body.items || existingOrder.items)

    const updatedOrder: Order = {
      ...existingOrder,
      ...body,
      totalPrice, // 更新總金額
      updatedAt: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    }

    await c.env.ORDERS.put(`order:${orderId}`, JSON.stringify(updatedOrder))
    return c.json({ message: '訂單已成功更新', order: updatedOrder })
  } catch (error) {
    console.error('更新訂單時發生錯誤:', error)
    return c.json({ message: '更新訂單時出現問題，請稍後再試。' }, 500)
  }
})

export default app
