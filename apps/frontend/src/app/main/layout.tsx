'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import Loading from '@/components/common/loading'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuth, checkAuth } = useUserStore()

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
    }
    initAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuth) {
      router.push('/login')
    }
  }, [isAuth, router])

  if (!isAuth) {
    return <Loading />
  }

  return <>{children}</>
} 