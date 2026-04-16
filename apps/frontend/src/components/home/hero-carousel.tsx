'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'
import { ReviewsTicker } from './reviews-ticker'

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
    description: '直接預訂，開始健康飲食生活',
    link: 'https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816'
  },
  {
    id: 2,
    src: '/home/burger.webp',
    title: '超好吃的漢堡',
    description: '大口吃肉、新鮮生菜、份量大',
    link: '/#brunch'
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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  const autoplay = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      playOnInit: true
    })
  )

  const handleImageLoad = useCallback((id: number) => {
    setLoaded((prev) => ({ ...prev, [id]: true }))
  }, [])

  useEffect(() => {
    if (!api) return

    const updateCurrent = () => setCurrent(api.selectedScrollSnap())
    updateCurrent()
    api.on('select', updateCurrent)

    const root = api.rootNode()
    const handleMouseLeave = () => autoplay.current.play()
    root.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      api.off('select', updateCurrent)
      root.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [api])

  return (
    <section
      className="relative flex flex-col items-center justify-center px-[8vw] py-16 text-[#5C4B51] mt-10"
      aria-label="首頁輪播圖"
    >
      <div className="w-full max-w-2xl h-[320px] relative z-10 rounded-3xl overflow-hidden">
        <Carousel
          plugins={[autoplay.current]}
          setApi={setApi}
          className="w-full h-full"
          opts={{ align: 'center', loop: true }}
        >
          <CarouselContent>
            {IMAGES.map((image, index) => (
              <CarouselItem key={image.id}>
                <Link
                  href={image.link}
                  target={image.link.startsWith('http') ? '_blank' : '_self'}
                  aria-label={`前往 ${image.title}`}
                >
                  <div className="relative w-full h-[320px] bg-[#FFF8E7]/80 rounded-3xl overflow-hidden flex items-center justify-center">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className={`object-cover transition-opacity duration-300 ${
                        loaded[image.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      priority={index <= 1}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 700px"
                      quality={90}
                      onLoad={() => handleImageLoad(image.id)}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
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
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {IMAGES.map((image, index) => (
              <button
                key={image.id}
                type="button"
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
      </div>

      <ReviewsTicker />
    </section>
  )
}
