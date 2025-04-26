'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useCallback } from 'react'
import Link from 'next/link'

interface CarouselImage {
  id: number
  src: string
  title: string
  description: string
  link: string
}

const IMAGES: CarouselImage[] = [
  {
    id: 1,
    src: '/image.webp',
    title: '加入官方line',
    description: '開始健康飲食生活',
    link: 'https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816'
  },
  {
    id: 2,
    src: '/logo.webp',
    title: '團購系統新上線',
    description: '點擊開起團購雞胸肉',
    link: '/login'
  },
  {
    id: 3,
    src: '/items/origin-chicken-breast.webp',
    title: '健康輕食選擇',
    description: '均衡營養的美味',
    link: '/#menu'
  }
]

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [loadedImages, setLoadedImages] = React.useState<Record<number, boolean>>({})
  
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      playOnInit: true
    })
  )

  const handleImageLoad = useCallback((id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }, [])

  useEffect(() => {
    if (!api) return

    const updateCurrent = () => setCurrent(api.selectedScrollSnap())
    updateCurrent()
    api.on('select', updateCurrent)

    const handleMouseLeave = () => plugin.current.play()
    const root = api.rootNode()
    root.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      api.off('select', updateCurrent)
      root.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [api])

  return (
    <section 
      className="relative flex items-center justify-center px-[8vw] py-16 text-[#5C4B51]"
      aria-label="首頁輪播圖"
    >
      <div 
        className="absolute inset-0 bg-[url('/story.webp')] bg-center bg-no-repeat bg-cover"
        style={{ backgroundSize: '100% 100%' }}
      />
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full max-w-2xl h-1/2 relative z-10"
        opts={{
          align: 'center',
          loop: true
        }}
      >
        <CarouselContent>
          {IMAGES.map((image, index) => (
            <CarouselItem key={image.id}>
              <Link 
                href={image.link} 
                target={image.link.startsWith('http') ? '_blank' : '_self'}
                aria-label={`前往 ${image.title}`}
              >
                <div className="relative w-full h-full bg-[#FFF8E7]/80">
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={500}
                    height={300}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      loadedImages[image.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority={index <= 1}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 700px"
                    loading={index <= 1 ? "eager" : "lazy"}
                    quality={90}
                    onLoad={() => handleImageLoad(image.id)}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <h2 className="text-2xl font-bold mb-1">{image.title}</h2>
                    <p className="text-base">{image.description}</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious aria-label="上一張" />
        <CarouselNext aria-label="下一張" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                current === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`前往第 ${index + 1} 張輪播圖`}
              aria-current={current === index}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
