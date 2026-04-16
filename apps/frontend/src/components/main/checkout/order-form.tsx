'use client'

import { useState } from 'react'

interface OrderFormProps {
  onSubmit: () => void | Promise<void>
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60'

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          姓名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          電話
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          電子郵件
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-1">
          付款方式
        </legend>
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
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-medium py-2 px-4 rounded-md transition-colors mt-4 bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-400 disabled:cursor-not-allowed"
        aria-label="submit"
      >
        {isSubmitting ? '處理中...' : '確認訂單'}
      </button>
    </form>
  )
}
