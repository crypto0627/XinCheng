export interface Order {
  id: string
  name: string
  phone: string
  email: string
  address: string
  items: { productId: number; name: string; price: number; quantity: number }[]
  paymentMethod: string
  totalPrice: number // 計算總金額
  orderStatus: 'pending' | 'completed' | 'canceled' // 訂單狀態
  createdAt: string
  updatedAt: string
}
