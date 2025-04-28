import { Context } from "hono"
import { getDB } from "../db"
import * as orderService from "../services/order.service"

export const orderProduct = async (c: Context) => {
  const db = getDB(c)
  const { email, items, totalAmount, totalQuantity, paymentMethod } = await c.req.json()

  // Find user by email
  const user = await orderService.findUserByEmail(db, email)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Create order
  const order = await orderService.createOrder(db, user.id, totalAmount, totalQuantity, paymentMethod)

  // Create order items
  await orderService.createOrderItems(db, order.id, items)

  // Send order confirmation email
  try {
    await orderService.sendOrderConfirmationEmail(
      email,
      user,
      order,
      items,
      totalQuantity,
      totalAmount,
      paymentMethod,
      c.env.RESEND_API_KEY
    )

  } catch (error) {
    return c.json({ error: 'Email server error, that can not sent mail.' }, 404)
  }

  return c.json({ message: '訂單創建成功', orderId: order.id })
}

// order Status
export const orderStatus = async(c: Context) => {
  const db = getDB(c)
  const { email } = await c.req.json()
  
  // Get user's orders and status
  const orderData = await orderService.getOrderStatusByEmail(db, email)
  
  if (!orderData) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ 
    message: '訂單狀態獲取成功',
    data: orderData
  })
}

// 新API：更新訂單狀態
export const updateOrderStatus = async(c: Context) => {
  const db = getDB(c)
  const { orderId, status } = await c.req.json()
  
  if (!orderId || !status) {
    return c.json({ error: 'Order ID and status are required' }, 400)
  }
  
  try {
    const updatedOrder = await orderService.updateOrderStatus(db, orderId, status)
    
    if (!updatedOrder) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // 如果狀態更新為已完成，發送訂單完成通知郵件
    if (status === 'completed') {
      try {
        // 獲取訂單詳細信息
        const orderDetails = await orderService.getOrderById(db, orderId)
        
        if (orderDetails && orderDetails.user) {
          // 發送訂單完成通知郵件
          await orderService.sendOrderCompletionEmail(
            orderDetails.user.email,
            orderDetails.user,
            { id: orderDetails.id },
            orderDetails.items,
            orderDetails.totalQuantity,
            orderDetails.totalAmount,
            orderDetails.paymentMethod,
            c.env.RESEND_API_KEY
          )
        }
      } catch (emailError) {
        console.error("Error sending order completion email:", emailError)
        // 我們不因為郵件發送失敗而中斷API響應，只記錄錯誤
      }
    }
    
    return c.json({
      message: '訂單狀態更新成功',
      data: updatedOrder
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return c.json({ error: 'Failed to update order status' }, 500)
  }
}

// 新API：獲取所有歷史訂單
export const getAllOrders = async(c: Context) => {
  const db = getDB(c)
  const { page = 1, limit = 10 } = await c.req.json()
  
  try {
    const allOrders = await orderService.getAllOrders(db, page, limit)
    
    return c.json({
      message: '所有訂單獲取成功',
      data: allOrders
    })
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return c.json({ error: 'Failed to retrieve all orders' }, 500)
  }
}
