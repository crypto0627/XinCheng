import { Order } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY || ''
}

export const orderService = {
    async createOrder(order: Order): Promise<{ message: string; orderId: string }> {
      const response = await fetch(`${API_URL}/api/order/orderProduct`, {
        method: 'POST',
        headers,
        body: JSON.stringify(order),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }
  
      return response.json()
    },

    async monitorStatus(email: string, status?: string): Promise<{ 
      message: string; 
      data: {
        user: {
          id: string;
          name: string;
          email: string;
        };
        stats: {
          total: number;
          processing: number;
          completed: number;
          cancelled: number;
        };
        orders: Array<{
          id: string;
          totalAmount: string;
          totalQuantity: number;
          paymentMethod: string;
          status: string;
          createdAt: string;
          items: Array<{
            id: string;
            productId: string;
            productName?: string;
            quantity: number;
            price: string;
          }>;
        }>;
      } 
    }> {
      const response = await fetch(`${API_URL}/api/order/orderStatus`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          email,
          status // Optional: Include status filter if provided
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get order status')
      }
  
      return response.json()
    }
}