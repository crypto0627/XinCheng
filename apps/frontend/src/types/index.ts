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
  name: string
  phone: string
  email: string
  address: string
  paymentMethod: string
  items: CartItem[]
  totalAmount: number
}
