'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckoutPage() {
  const { isAuth, logout } = useAuthStore()
  const router = useRouter()
  
  useEffect(() => {
    if (!isAuth) {
      router.push('/pre-order')
    }
  }, [isAuth, router])
  
  const handleLogout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY as string,
      },
    })
    if (response.ok) {
      logout()
      router.push('/pre-order')
    } else {
      throw new Error('Failed to logout')
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      {isAuth && <button onClick={handleLogout}>Logout</button>}
    </div>
  )
}