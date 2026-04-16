export interface Product {
  id: string
  productName: string
  price: number
  img: string
  weight: string
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}
