import { Order } from '@/types'

export class OrderService {
  private static API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/orders` || ''

  // 获取所有订单
  public static async getAllOrders(): Promise<Order[]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      })
      if (!response.ok) {
        throw new Error('獲取訂單列表失敗')
      }

      const data = await response.json()
      return data.filter(Boolean) // 過濾掉 null 值
    } catch (error) {
      console.error('獲取訂單時發生錯誤:', error)
      throw error
    }
  }

  // 更新订单
  public static async updateOrder(
    orderId: string,
    orderData: any,
  ): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('訂單更新失敗')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('更新訂單時發生錯誤:', error)
      throw error
    }
  }

  // 删除订单
  public static async deleteOrder(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/${orderId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      })

      if (!response.ok) {
        throw new Error('訂單刪除失敗')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('刪除訂單時發生錯誤:', error)
      throw error
    }
  }
}
