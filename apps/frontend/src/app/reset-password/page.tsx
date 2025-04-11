'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  if (!token) {
    Swal.fire({
      title: 'Error',
      text: 'Invalid reset password link', 
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/pre-order')
    })
    return null
  }

  const resetPassword = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Password reset successfully! Redirecting to login...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        router.push('/pre-order')
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to reset password',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        router.push('/pre-order')
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'An error occurred while resetting your password',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      router.push('/pre-order')
    }
  }

  resetPassword()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Reset Password
          </h2>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
