'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CartItem, Order } from '@/types'
import { OrderSummary } from '@/components/main/checkout/order-summary'
import { OrderForm } from '@/components/main/checkout/oreder-form'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        setCartItems(parsedCart)
        
        const total = parsedCart.reduce(
          (sum: number, item: CartItem) => sum + item.product.price * item.quantity, 
          0
        )
        setTotalAmount(total)
      } catch (error) {
        console.error('Failed to parse cart data:', error)
      }
    }
  }, [])

  const handleOrderSubmit = (order: Order) => {
    console.log('Order submitted:', order)
    // Handle order submission, e.g., send to backend API
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">結帳頁面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <OrderSummary cartItems={cartItems} totalAmount={totalAmount} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">訂購資訊</h2>
          <OrderForm cartItems={cartItems} totalAmount={totalAmount} onSubmit={handleOrderSubmit} />
        </div>
      </div>
    </div>
  )
}