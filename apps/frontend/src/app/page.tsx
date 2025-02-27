import Navbar from "@/components/navbar"
import HeroCarousel from "@/components/hero-carousel"
import FeaturedMenu from "@/components/featured-menu"
import LatestNews from "@/components/latest-news"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroCarousel />
      <FeaturedMenu />
      <LatestNews />
      <Footer />
    </main>
  )
}

