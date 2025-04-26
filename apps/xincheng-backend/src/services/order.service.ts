import { eq, sql, and, SQL } from "drizzle-orm";
import { users, orders, orderItems, orderStatusEnum } from "../db/schema";
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
  
  // Format items for email (table rows)
  const itemsList = items.map((item: OrderItem) => 
    `<tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${item.productName}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">$${item.price}</td>
    </tr>`
  ).join('');
  
  await resend.emails.send({
    from: 'mail-service-manager@xincheng-brunch.com',
    to: email,
    subject: `星橙：訂單成立通知 #${order.id}`,
    html: `
      <div style="background: #f8f9fa; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, '微軟正黑體', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background: #FF6B35; padding: 24px; text-align: center;">
            <h1 style="color: #fff; font-size: 28px; margin: 0; letter-spacing: 2px;">訂單確認</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 16px;">親愛的 <strong>${user.name}</strong>，</p>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">感謝您的訂購！以下是您的訂單詳情：</p>
            <table style="width: 100%; margin-bottom: 20px; font-size: 15px; color: #444;">
              <tr><td style="padding: 6px 0;">訂單編號：</td><td style="padding: 6px 0;">${order.id}</td></tr>
              <tr><td style="padding: 6px 0;">訂單日期：</td><td style="padding: 6px 0;">${new Date().toLocaleDateString('zh-TW')}</td></tr>
              <tr><td style="padding: 6px 0;">付款方式：</td><td style="padding: 6px 0;">${paymentMethod}</td></tr>
            </table>
            <h2 style="font-size: 18px; color: #FF6B35; margin: 24px 0 12px 0;">訂購商品</h2>
            <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 6px; overflow: hidden;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px 12px; text-align: left;">商品名稱</th>
                  <th style="padding: 10px 12px; text-align: center;">數量</th>
                  <th style="padding: 10px 12px; text-align: right;">價格</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            <table style="width: 100%; margin-top: 20px; font-size: 16px;">
              <tr>
                <td style="padding: 6px 0;">總數量：</td>
                <td style="padding: 6px 0; color: #FF6B35; font-weight: bold;">${totalQuantity}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">總金額：</td>
                <td style="padding: 6px 0; color: #FF6B35; font-weight: bold;">$${totalAmount}</td>
              </tr>
            </table>
            <p style="margin-top: 32px; font-size: 15px; color: #666;">我們將盡快處理您的訂單，完成後會再通知您。</p>
            <p style="font-size: 15px; color: #666;">如有任何問題，請隨時與我們聯繫。</p>
            <p style="font-size: 15px; color: #888; margin-top: 32px;">星橙早午餐 敬上</p>
          </div>
        </div>
      </div>
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

// 新增函數 - 獲取所有待處理訂單
export const getPendingOrders = async (db: DrizzleInstance) => {
  // 獲取所有狀態為 'processing' 的訂單
  const pendingOrders = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      totalAmount: orders.totalAmount,
      totalQuantity: orders.totalQuantity,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      createdAt: orders.createdAt
    })
    .from(orders)
    .where(eq(orders.status, 'processing'))
    .orderBy(orders.createdAt);

  // 獲取每個訂單的用戶信息和訂單項目
  const ordersWithDetails = await Promise.all(
    pendingOrders.map(async (order) => {
      // 獲取用戶信息
      const user = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone
        })
        .from(users)
        .where(eq(users.id, order.userId))
        .then(rows => rows[0]);

      // 獲取訂單項目
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

      // 格式化日期
      const createdAtDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = createdAtDate.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      // 處理訂單項目，確保 productName 存在並格式化價格
      const processedItems = items.map(item => ({
        ...item,
        productName: item.productName || `Product ${item.productId.substring(0, 8)}`,
        price: Number(item.price).toFixed(2)
      }));

      return {
        ...order,
        createdAt: formattedDate,
        totalAmount: Number(order.totalAmount).toFixed(2),
        user,
        items: processedItems
      };
    })
  );

  return ordersWithDetails;
};

// 新增函數 - 更新訂單狀態
export const updateOrderStatus = async (db: DrizzleInstance, orderId: string, status: string) => {
  // 檢查狀態值是否有效
  if (!['processing', 'completed', 'cancelled'].includes(status)) {
    throw new Error('Invalid status value');
  }

  // 更新訂單狀態
  const [updatedOrder] = await db
    .update(orders)
    .set({ 
      status: status as typeof orderStatusEnum[number],
      updatedAt: new Date().toISOString()
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
      status: orders.status,
      updatedAt: orders.updatedAt
    });

  if (!updatedOrder) {
    return null;
  }

  return updatedOrder;
};

// 新增函數 - 發送訂單完成通知郵件
export const sendOrderCompletionEmail = async (
  email: string,
  user: any,
  order: { id: string },
  items: any[], // 使用any[]來接受處理過的items陣列
  totalQuantity: number,
  totalAmount: string | number, // 允許字符串或數字
  paymentMethod: string,
  resendApiKey: string
) => {
  const resend = new Resend(resendApiKey);
  
  // 格式化商品列表 (table rows)
  const itemsList = items.map((item) => 
    `<tr>
      <td style=\"padding: 8px 12px; border-bottom: 1px solid #f0f0f0;\">${item.productName}</td>
      <td style=\"padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: center;\">${item.quantity}</td>
      <td style=\"padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: right;\">$${item.price}</td>
    </tr>`
  ).join('');
  
  await resend.emails.send({
    from: 'xmail-service-manager@xincheng-brunch.com',
    to: email,
    subject: `星橙：您的貨到付款訂單已完成 #${order.id}，請至店內取貨！`,
    html: `
      <div style=\"background: #f8f9fa; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, '微軟正黑體', sans-serif;\">
        <div style=\"max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;\">
          <div style=\"background: #FF6B35; padding: 24px; text-align: center;\">
            <h1 style=\"color: #fff; font-size: 28px; margin: 0; letter-spacing: 2px;\">訂單已完成，請至店內取貨！</h1>
          </div>
          <div style=\"padding: 32px;\">
            <p style=\"font-size: 18px; color: #333; margin-bottom: 16px;\">親愛的 <strong>${user.name}</strong>，</p>
            <p style=\"font-size: 16px; color: #333; margin-bottom: 24px;\">您的訂單已經完成處理。以下是您的訂單詳情：</p>
            <table style=\"width: 100%; margin-bottom: 20px; font-size: 15px; color: #444;\">
              <tr><td style=\"padding: 6px 0;\">訂單編號：</td><td style=\"padding: 6px 0;\">${order.id}</td></tr>
              <tr><td style=\"padding: 6px 0;\">付款方式：</td><td style=\"padding: 6px 0;\">${paymentMethod}</td></tr>
            </table>
            <h2 style=\"font-size: 18px; color: #FF6B35; margin: 24px 0 12px 0;\">訂購商品</h2>
            <table style=\"width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 6px; overflow: hidden;\">
              <thead>
                <tr style=\"background: #f0f0f0;\">
                  <th style=\"padding: 10px 12px; text-align: left;\">商品名稱</th>
                  <th style=\"padding: 10px 12px; text-align: center;\">數量</th>
                  <th style=\"padding: 10px 12px; text-align: right;\">價格</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            <table style=\"width: 100%; margin-top: 20px; font-size: 16px;\">
              <tr>
                <td style=\"padding: 6px 0;\">總數量：</td>
                <td style=\"padding: 6px 0; color: #FF6B35; font-weight: bold;\">${totalQuantity}</td>
              </tr>
              <tr>
                <td style=\"padding: 6px 0;\">總金額：</td>
                <td style=\"padding: 6px 0; color: #FF6B35; font-weight: bold;\">$${totalAmount}</td>
              </tr>
            </table>
            <p style=\"margin-top: 32px; font-size: 15px; color: #666;\">感謝您的購買！如有任何問題，請隨時與我們聯繫。</p>
            <p style=\"font-size: 15px; color: #888; margin-top: 32px;\">星橙早午餐 敬上</p>
          </div>
        </div>
      </div>
    `
  });
};

// 新增函數 - 獲取訂單詳細信息
export const getOrderById = async (db: DrizzleInstance, orderId: string) => {
  // 獲取訂單基本信息
  const order = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      totalAmount: orders.totalAmount,
      totalQuantity: orders.totalQuantity,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .then(rows => rows[0]);

  if (!order) {
    return null;
  }

  // 獲取用戶信息
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone
    })
    .from(users)
    .where(eq(users.id, order.userId))
    .then(rows => rows[0]);

  // 獲取訂單項目
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

  // 格式化日期
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 處理訂單項目，確保 productName 存在並格式化價格
  const processedItems = items.map(item => ({
    ...item,
    productName: item.productName || `Product ${item.productId.substring(0, 8)}`,
    price: Number(item.price).toFixed(2)
  }));

  return {
    ...order,
    createdAt: formatDate(order.createdAt),
    updatedAt: formatDate(order.updatedAt),
    totalAmount: Number(order.totalAmount).toFixed(2),
    user,
    items: processedItems
  };
};

// 新增函數 - 獲取所有訂單(分頁)
export const getAllOrders = async (db: DrizzleInstance, page: number = 1, limit: number = 10) => {
  // 計算跳過的記錄數
  const offset = (page - 1) * limit;

  // 獲取所有訂單總數
  const totalCountResult = await db
    .select({ count: sql`count(*)` })
    .from(orders);
  
  const totalCount = Number(totalCountResult[0]?.count || 0);
  const totalPages = Math.ceil(totalCount / limit);

  // 獲取訂單列表
  const ordersList = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      totalAmount: orders.totalAmount,
      totalQuantity: orders.totalQuantity,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      createdAt: orders.createdAt
    })
    .from(orders)
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  // 獲取每個訂單的用戶信息和訂單項目
  const ordersWithDetails = await Promise.all(
    ordersList.map(async (order) => {
      // 獲取用戶信息
      const user = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email
        })
        .from(users)
        .where(eq(users.id, order.userId))
        .then(rows => rows[0]);

      // 獲取訂單項目
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

      // 格式化日期
      const createdAtDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = createdAtDate.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      // 處理訂單項目，確保 productName 存在並格式化價格
      const processedItems = items.map(item => ({
        ...item,
        productName: item.productName || `Product ${item.productId.substring(0, 8)}`,
        price: Number(item.price).toFixed(2)
      }));

      return {
        ...order,
        createdAt: formattedDate,
        totalAmount: Number(order.totalAmount).toFixed(2),
        user,
        items: processedItems
      };
    })
  );

  return {
    orders: ordersWithDetails,
    pagination: {
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    }
  };
};

// 輔助函數 - 安全組合SQL條件
const safeAnd = (a: SQL<unknown>, b: SQL<unknown>): SQL<unknown> => {
  const result = and(a, b);
  // 這是一個安全檢查，實際上 and() 不應該回傳 undefined
  return result || sql`(${a}) AND (${b})`;
};

// 新增函數 - 獲取收益數據
export const getRevenueData = async (db: DrizzleInstance, timeRange: string) => {
  let dateFilter: { from?: string, to?: string } = {};
  const now = new Date();
  
  // 根據時間範圍設置過濾條件
  switch (timeRange) {
    case 'today':
    case '今日':
      // 今天 UTC+8
      dateFilter = { from: new Date(now.setUTCHours(0, 0, 0, 0) + 8 * 60 * 60 * 1000).toISOString() };
      break;
    case 'yesterday':
      // 昨天 UTC+8
      const yesterday = new Date(now);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setUTCHours(23, 59, 59, 999);
      dateFilter = { 
        from: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000).toISOString(), 
        to: new Date(endOfYesterday.getTime() + 8 * 60 * 60 * 1000).toISOString() 
      };
      break;
    case 'week':
    case '本週':
      // 本週 UTC+8
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay()); // 週日作為一週的開始
      startOfWeek.setUTCHours(0, 0, 0, 0);
      dateFilter = { from: new Date(startOfWeek.getTime() + 8 * 60 * 60 * 1000).toISOString() };
      break;
    case 'month':
    case '本月':
      // 本月 UTC+8
      const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      dateFilter = { from: new Date(startOfMonth.getTime() + 8 * 60 * 60 * 1000).toISOString() };
      break;
    case '本季':
      // 本季度 UTC+8
      const currentQuarter = Math.floor(now.getUTCMonth() / 3);
      const startOfQuarter = new Date(Date.UTC(now.getUTCFullYear(), currentQuarter * 3, 1));
      dateFilter = { from: new Date(startOfQuarter.getTime() + 8 * 60 * 60 * 1000).toISOString() };
      break;
    case '本年':
      // 本年 UTC+8
      const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      dateFilter = { from: new Date(startOfYear.getTime() + 8 * 60 * 60 * 1000).toISOString() };
      break;
    default:
      // 全部時間
      dateFilter = {};
      break;
  }

  // 構建查詢條件
  let whereConditions: SQL<unknown> = eq(orders.status, 'completed'); // 只計算已完成的訂單
  
  // 如果有日期過濾條件，添加到查詢中
  if (dateFilter.from) {
    const fromCondition = sql`${orders.createdAt} >= ${dateFilter.from}`;
    whereConditions = safeAnd(whereConditions, fromCondition);
  }
  
  if (dateFilter.to) {
    const toCondition = sql`${orders.createdAt} <= ${dateFilter.to}`;
    whereConditions = safeAnd(whereConditions, toCondition);
  }

  const completedOrders = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt
    })
    .from(orders)
    .where(whereConditions);

  // 計算總收益
  const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  
  // 計算日平均收益
  const calculateDailyAverage = () => {
    if (completedOrders.length === 0) return 0;
    
    // 根據不同的時間範圍計算天數
    let dayCount = 1; // 默認為1天
    
    if (timeRange === 'week') {
      // 本週已經過去的天數
      dayCount = Math.min(now.getDay() + 1, 7);
    } else if (timeRange === 'month') {
      // 本月已經過去的天數
      dayCount = now.getDate();
    } else if (timeRange === 'all') {
      // 全部時間計算總天數
      if (completedOrders.length > 0) {
        // 找出第一筆訂單的日期
        const dates = completedOrders.map(order => new Date(order.createdAt || Date.now()));
        const firstOrderDate = new Date(Math.min(...dates.map(d => d.getTime())));
        
        // 計算從第一筆訂單到現在的天數
        const diffTime = Math.abs(now.getTime() - firstOrderDate.getTime());
        dayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        dayCount = Math.max(dayCount, 1); // 至少1天
      }
    }
    
    return totalRevenue / dayCount;
  };
  
  const dailyAverage = calculateDailyAverage();

  // 獲取訂單數量統計
  const orderStats = {
    total: completedOrders.length,
    totalRevenue: totalRevenue.toFixed(2),
    dailyAverage: dailyAverage.toFixed(2)
  };

  // 可選：獲取熱門商品統計
  const popularProducts = await getPopularProducts(db, dateFilter);

  return {
    timeRange,
    stats: orderStats,
    popularProducts
  };
};

// 輔助函數 - 獲取熱門商品
const getPopularProducts = async (db: DrizzleInstance, dateFilter: { from?: string, to?: string } = {}) => {
  // 構建查詢條件
  let whereConditions: SQL<unknown> = eq(orders.status, 'completed');
  
  // 添加日期過濾
  if (dateFilter.from) {
    const fromCondition = sql`${orders.createdAt} >= ${dateFilter.from}`;
    whereConditions = safeAnd(whereConditions, fromCondition);
  }
  
  if (dateFilter.to) {
    const toCondition = sql`${orders.createdAt} <= ${dateFilter.to}`;
    whereConditions = safeAnd(whereConditions, toCondition);
  }

  // 獲取已完成訂單的 ID
  const completedOrderIds = await db
    .select({ id: orders.id })
    .from(orders)
    .where(whereConditions);
  
  if (completedOrderIds.length === 0) {
    return [];
  }

  // 獲取這些訂單中的所有商品
  const orderItemsResult = await db
    .select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      quantity: orderItems.quantity,
      price: orderItems.price
    })
    .from(orderItems)
    .where(sql`${orderItems.orderId} IN (${completedOrderIds.map(o => o.id).join(',')})`);

  // 計算每個商品的銷售情況
  const productMap = new Map();
  
  orderItemsResult.forEach(item => {
    const productId = item.productId;
    const productName = item.productName || `Product ${productId.substring(0, 8)}`;
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    
    if (productMap.has(productId)) {
      const existing = productMap.get(productId);
      existing.quantity += quantity;
      existing.revenue += price * quantity;
      productMap.set(productId, existing);
    } else {
      productMap.set(productId, {
        productId,
        productName,
        quantity,
        revenue: price * quantity
      });
    }
  });
  
  // 轉換為陣列並排序
  const popularProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10) // 取前10名
    .map(product => ({
      ...product,
      revenue: product.revenue.toFixed(2)
    }));
    
  return popularProducts;
};
