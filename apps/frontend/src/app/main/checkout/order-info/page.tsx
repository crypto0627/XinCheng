'use client';

import { useState } from 'react';
import { OrderStatus } from '@/components/main/checkout/order-info/order-status';

export default function MyOrdersPage() {
  // In a real app, this would come from your auth system
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };
  
  return (
    <div className="container mx-auto px-4 flex flex-col justify-center min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">我的訂單</h1>
      
      {!isSubmitted ? (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md w-full">
          <p className="mb-6 text-center">請輸入您的郵箱地址以查看訂單狀態</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                電子郵箱
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              type="submit"
              aria-label='order-watch'
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              查看訂單
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full">
          <OrderStatus email={email} />
        </div>
      )}
    </div>
  );
} 