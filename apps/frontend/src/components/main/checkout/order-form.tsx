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
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          if (user.email) setEmail(user.email)
          if (user.name) setName(user.name)
          if (user.phone) setPhone(user.phone)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const order = {
        email: email,
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.productName,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: totalAmount,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        paymentMethod: (event.target as any).payment.value
      };
      await onSubmit(order);
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleOrderSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input 
          type="text" 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">電話</label>
        <input 
          type="tel" 
          id="phone" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">付款方式</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="payment" 
              value="cash" 
              className="mr-2" 
              defaultChecked
              disabled={isSubmitting} 
            />
            <span>貨到付款</span>
          </label>
        </div>
      </div>
      
      <button 
        type="submit" 
        className={`w-full font-medium py-2 px-4 rounded-md transition-colors mt-4 ${
          isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'
        }`}
        disabled={isSubmitting}
        aria-label='submit'
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            處理中...
          </div>
        ) : (
          '確認訂單'
        )}
      </button>
    </form>
  )
}