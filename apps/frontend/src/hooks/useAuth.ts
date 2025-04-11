import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/store/useAuthStore'

export function useAuth() {
    const { isAuth, setIsAuth } = useAuthStore()
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    const fetchUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            })
        if(response.ok){
            const data = await response.json()
            setUser(data)
            setIsAuth(true)
        } else {
            setUser(null)
            setIsAuth(false)
        }
        } catch (error) {
            setUser(null)
            setIsAuth(false)
            console.error('Error fetching user:', error)
            if(router.pathname === '/checkout'){
                router.push('/pre-order')
            }
        }
    }
    useEffect(()=>{
        fetchUser()
    }, [])
    return { user, isAuth }
}