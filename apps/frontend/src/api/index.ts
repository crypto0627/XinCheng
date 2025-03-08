export class OrderService {
  private static API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/orders` || ''
  // 创建订单
  public static async createOrder(orderData: any): Promise<any> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify(orderData),
      })
  
      if (!response.ok) {
        console.log(response)
        throw new Error('訂單創建失敗')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('創建訂單時發生錯誤:', error)
      throw error
    }
  }
  
  // 获取所有订单
  public static async getAllOrders(): Promise<any> {
    try {
      const response = await fetch(this.API_URL)
      if (!response.ok) {
        throw new Error('獲取訂單列表失敗')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('獲取訂單時發生錯誤:', error)
      throw error
    }
  }
  
  // 更新订单
  public static async updateOrder(orderId: string, orderData: any): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
  