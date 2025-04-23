const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

/**
 * Create authenticated request headers
 */
export const createAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY || '',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Get pending orders
 */
export const getPendingOrders = async (token?: string) => {
  try {
    const response = await fetch(`${API_URL}/api/order/orderCheck`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({}),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getPendingOrders:', error);
    return { error: 'Failed to get pending orders', message: 'Operation failed' };
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: string, token?: string) => {
  try {
    const response = await fetch(`${API_URL}/api/order/updateOrderStatus`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ orderId, status }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return { error: 'Failed to update order status', message: 'Operation failed' };
  }
};

/**
 * Get order details
 */
export const getOrderDetails = async (orderId: string, token?: string) => {
  try {
    const response = await fetch(`${API_URL}/api/order/getOrderDetails`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ orderId }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    return { error: 'Failed to get order details', message: 'Operation failed' };
  }
};

/**
 * Get all orders with pagination
 */
export const getAllOrders = async (page: number = 1, limit: number = 10, token?: string) => {
  try {
    const response = await fetch(`${API_URL}/api/order/getAllOrders`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ page, limit }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    return { error: 'Failed to get all orders', message: 'Operation failed' };
  }
};

/**
 * Get revenue data
 */
export const getRevenue = async (timeRange: string = 'all', token?: string) => {
  try {
    const response = await fetch(`${API_URL}/api/order/getRevenue`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ timeRange }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getRevenue:', error);
    return { error: 'Failed to get revenue data', message: 'Operation failed' };
  }
};
