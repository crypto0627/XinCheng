'use client'
import FeaturedMenu from '@/components/home/featured-menu'
import HeroCarousel from '@/components/home/hero-carousel'
import BrunchSection from '@/components/home/brunch'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden transition-transform duration-500 ease-out will-change-transform bg-[color:var(--background)]">
      <HeroCarousel />
      <FeaturedMenu />
      <BrunchSection />
    </main>
  )
}
