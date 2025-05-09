'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CartItem, Order } from '@/types'
import { OrderSummary } from '@/components/main/checkout/order-summary'
import { OrderForm } from '@/components/main/checkout/order-form'
import { authService } from '@/services/authService'
import { orderService } from '@/services/orderService'
import Swal from 'sweetalert2'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (!user) {
          await Swal.fire({
            title: '請先登入',
            text: '您需要登入才能訪問結帳頁面',
            icon: 'warning',
            confirmButtonText: '前往登入'
          })
          router.push('/login')
        }
      } catch (error) {
        await Swal.fire({
          title: '請先登入',
          text: '您需要登入才能訪問結帳頁面',
          icon: 'warning',
          confirmButtonText: '前往登入'
        })
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

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

  const handleOrderSubmit = async (order: Order) => {
    try {
      const result = await orderService.createOrder(order)
      await Swal.fire({
        title: '訂單成功',
        text: `您的訂單已成功創建，訂單編號：${result.orderId}，並已寄出email，訂單完成後會再通知您。`,
        icon: 'success',
        confirmButtonText: '確定'
      })
      localStorage.removeItem('cart')
      router.push('/main/checkout/order-confirmation')
    } catch (error) {
      console.error('Order submission error:', error)
      await Swal.fire({
        title: '錯誤',
        text: (error as Error).message || '訂單創建失敗',
        icon: 'error',
        confirmButtonText: '確定'
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
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