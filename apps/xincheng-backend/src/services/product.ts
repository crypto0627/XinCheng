import { Product } from '../types'

export const products: Product[] = [
  { id: 1, name: '商品 A', price: 100, available: true },
  { id: 2, name: '商品 B', price: 200, available: true },
  { id: 3, name: '商品 C', price: 300, available: true },
]

export const getProducts = () => products