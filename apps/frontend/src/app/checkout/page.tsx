'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { isAuth, user } = useAuth()
  const router = useRouter()
  
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
      router.push('/pre-order')
    } else {
      throw new Error('Failed to logout')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1>Checkout</h1>
      {isAuth && 
      <div className='flex flex-col items-center justify-center'>
        <p className='text-2xl font-bold'>Welcome, {user.username}</p>
        <button className='bg-blue-500 text-white p-2 rounded-md' onClick={handleLogout}>Logout</button>
      </div>
      }
    </div>
  )
}