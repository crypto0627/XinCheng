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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">我的訂單</h1>
      
      {!isSubmitted ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">請輸入您的郵箱地址以查看訂單狀態</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                電子郵箱
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              查看訂單
            </button>
          </form>
        </div>
      ) : (
        <OrderStatus email={email} />
      )}
    </div>
  );
} 