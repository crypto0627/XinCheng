'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { OrderSummary } from '@/components/main/checkout/order-summary'
import { OrderForm } from '@/components/main/checkout/order-form'
import type { CartItem } from '@/types'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('cart')
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    setCartItems(loadCart())
  }, [])

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleOrderSubmit = async () => {
    await Swal.fire({
      title: '訂單成功',
      text: '您的訂單已成功建立',
      icon: 'success',
      confirmButtonText: '確定'
    })
    localStorage.removeItem('cart')
    router.push('/main/checkout/order-confirmation')
  }

  return (
    <main className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
        結帳頁面
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <OrderSummary cartItems={cartItems} totalAmount={totalAmount} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">訂購資訊</h2>
          <OrderForm onSubmit={handleOrderSubmit} />
        </div>
      </div>
    </main>
  )
}
