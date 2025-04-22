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

  return c.json({ message: 'Order created successfully', orderId: order.id })
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
    message: 'Order status retrieved successfully',
    data: orderData
  })
}