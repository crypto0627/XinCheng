'use client'
import { useState, useEffect } from 'react'
import HeroCarousel from '@/components/hero-carousel'
import FeaturedMenu from '@/components/featured-menu'
import LatestNews from '@/components/latest-news'
import Loading from '@/components/loading'

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
      <LatestNews />
    </main>
  )
}
