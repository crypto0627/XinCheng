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
  productId: string
  name: string
  description: string
  price: number
  image: string
}

export interface CartItem extends Product {
  quantity: number
}
