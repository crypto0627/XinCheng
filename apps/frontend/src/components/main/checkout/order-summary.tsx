'use client'

import { CartItem } from '@/types'

interface OrderSummaryProps {
  cartItems: CartItem[]
  totalAmount: number
}

export function OrderSummary({ cartItems, totalAmount }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">訂單明細</h2>
      {cartItems.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item, index) => (
            <li key={index} className="py-4 flex justify-between">
              <div className="flex items-center">
                <img 
                  src={item.product.img} 
                  alt={item.product.productName} 
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{item.product.productName}</h3>
                  <p className="text-sm text-gray-500">{item.product.weight}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700">{item.quantity} x ${item.product.price}</p>
                <p className="font-bold text-orange-500">${item.product.price * item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 py-4">購物車是空的</p>
      )}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">總金額</span>
          <span className="font-bold text-2xl text-orange-500">${totalAmount}</span>
        </div>
      </div>
    </div>
  )
}