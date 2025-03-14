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
}
  