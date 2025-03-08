export interface Order {
  id: string
  name: string
  phone: string
  email: string
  address: string
  items: { productId: number; quantity: number }[]
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  price: number
  available: boolean
}
