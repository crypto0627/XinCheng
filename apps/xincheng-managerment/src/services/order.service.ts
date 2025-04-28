const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

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
