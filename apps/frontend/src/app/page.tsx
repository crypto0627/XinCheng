'use client'
import Loading from '@/components/common/loading'
import FeaturedMenu from '@/components/home/featured-menu'
import HeroCarousel from '@/components/home/hero-carousel'
import { useEffect, useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      requestAnimationFrame(() => {
        setExpand(true)
      })
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <main
      className={`flex min-h-screen flex-col overflow-hidden transition-transform duration-500 ease-out will-change-transform ${
        expand ? 'scale-x-100' : 'scale-x-0'
      }`}
    >
      <HeroCarousel />
      <FeaturedMenu />
    </main>
  )
}
