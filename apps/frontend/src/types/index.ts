export interface FeaturedItem {
  id: number
  name: string
  type: string
  image: string
  description: string
  calories: number
  nutrition: {
    carbs: number
    protein: number
    fat: number
  }
  price: number
}

export interface Product {
  id: string
  productName: string
  price: number
  img: string
  weight: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  email: string
  totalAmount: number
  totalQuantity: number
  paymentMethod: string
  status?: 'processing' | 'completed' | 'cancelled'
  createdAt?: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
}

export interface OrderResponse {
  message: string
  orderId: string
}
