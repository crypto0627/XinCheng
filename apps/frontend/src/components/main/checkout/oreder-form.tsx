'use client'

import { useEffect, useState } from 'react'
import { CartItem, Order } from '@/types'
import { authService } from '@/services/authService'

interface OrderFormProps {
  cartItems: CartItem[]
  totalAmount: number
  onSubmit: (order: Order) => void
}

export function OrderForm({ cartItems, totalAmount, onSubmit }: OrderFormProps) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user && user.email) {
          setEmail(user.email)
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error)
      }
    }

    fetchUserEmail()
  }, [])

  const handleOrderSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    
    const order: Order = {
      name: (event.target as any).name.value,
      phone: (event.target as any).phone.value,
      email: (event.target as any).email.value,
      address: (event.target as any).address.value,
      paymentMethod: (event.target as any).payment.value,
      items: cartItems,
      totalAmount: totalAmount
    }

    onSubmit(order)
  }

  return (
    <form className="space-y-4" onSubmit={handleOrderSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input 
          type="text" 
          id="name" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">電話</label>
        <input 
          type="tel" 
          id="phone" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
        <input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">地址</label>
        <input 
          type="text" 
          id="address" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">付款方式</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="payment" value="cash" className="mr-2" defaultChecked />
            <span>貨到付款</span>
          </label>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors mt-4"
      >
        確認訂單
      </button>
    </form>
  )
}