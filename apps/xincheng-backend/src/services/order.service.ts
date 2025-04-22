import { eq } from "drizzle-orm";
import { users, orders, orderItems } from "../db/schema";
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { DrizzleInstance, OrderItem } from "../types";


export const findUserByEmail = async (db: DrizzleInstance, email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((rows: any[]) => rows[0]);
};

export const createOrder = async (
  db: DrizzleInstance,
  userId: string,
  totalAmount: number,
  totalQuantity: number,
  paymentMethod: string
) => {
  const orderId = uuidv4();
  const [order] = await db.insert(orders).values({
    id: orderId,
    userId: userId,
    totalAmount: totalAmount,
    totalQuantity: totalQuantity,
    paymentMethod: paymentMethod,
    status: 'processing',
    createdAt: new Date().toISOString()
  }).returning({ id: orders.id });

  return order;
};

export const createOrderItems = async (
  db: DrizzleInstance,
  orderId: string,
  items: OrderItem[]
) => {
  for (const item of items) {
    await db.insert(orderItems).values({
      id: uuidv4(),
      orderId: orderId,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price
    });
  }
};

export const sendOrderConfirmationEmail = async (
  email: string,
  user: any,
  order: { id: string },
  items: OrderItem[],
  totalQuantity: number,
  totalAmount: number,
  paymentMethod: string,
  resendApiKey: string
) => {
  const resend = new Resend(resendApiKey);
  
  // Format items for email
  const itemsList = items.map((item: OrderItem) => 
    `<li>商品: ${item.productName}, 數量: ${item.quantity}, 價格: $${item.price}</li>`
  ).join('');
  
  await resend.emails.send({
    from: 'xincheng@jakekuo.com',
    to: email,
    subject: `訂單確認 #${order.id}`,
    html: `
      <h1>訂單確認</h1>
      <p>親愛的 ${user.name}，</p>
      <p>感謝您的訂購。以下是您的訂單詳情：</p>
      <p><strong>訂單編號：</strong> ${order.id}</p>
      <p><strong>訂單日期：</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>付款方式：</strong> ${paymentMethod}</p>
      <h2>訂購商品：</h2>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>總數量：</strong> ${totalQuantity}</p>
      <p><strong>總金額：</strong> $${totalAmount}</p>
      <p>我們將盡快處理您的訂單。訂單完成後會再通知您。</p>
      <p>如有任何問題，請隨時與我們聯繫。</p>
      <p>謝謝！</p>
    `
  });
};

export const getOrdersByUserId = async (db: DrizzleInstance, userId: string) => {
  // Get all orders for the user
  const userOrders = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      totalQuantity: orders.totalQuantity,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      createdAt: orders.createdAt
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(orders.createdAt);

  // For each order, get the order items
  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          productName: orderItems.productName,
          quantity: orderItems.quantity,
          price: orderItems.price
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      // Format the date string to be more readable
      const createdAtDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = createdAtDate.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Process items to include productName and format price
      const processedItems = items.map(item => ({
        ...item,
        // Use stored productName if available, otherwise use a fallback
        productName: item.productName || `Product ${item.productId.substring(0, 8)}`,
        // Format price to 2 decimal places
        price: Number(item.price).toFixed(2)
      }));

      return {
        ...order,
        createdAt: formattedDate,
        items: processedItems,
        // Format total to 2 decimal places
        totalAmount: Number(order.totalAmount).toFixed(2)
      };
    })
  );

  return ordersWithItems;
};

export const getOrderStatusByEmail = async (db: DrizzleInstance, email: string) => {
  // Find the user by email
  const user = await findUserByEmail(db, email);
  
  if (!user) {
    return null;
  }

  // Get all orders with items for this user
  const orders = await getOrdersByUserId(db, user.id);
  
  // Count orders by status
  const orderStats = {
    total: orders.length,
    processing: orders.filter(order => order.status === 'processing').length,
    completed: orders.filter(order => order.status === 'completed').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
  };

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    stats: orderStats,
    orders
  };
}; 