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

const images = [
  {
    id: 1,
    src: '/image.png',
    title: '美味早午餐',
    description: '開啟美好的一天'
  },
  {
    id: 2,
    src: '/logo.png',
    title: '週末限定特餐',
    description: '豐盛的假日饗宴'
  },
  {
    id: 3,
    src: '/logo.png',
    title: '健康輕食選擇',
    description: '均衡營養的美味'
  },
  {
    id: 4,
    src: '/logo.png',
    title: '精選套餐',
    description: '多樣化的美食選擇'
  },
  {
    id: 5,
    src: '/logo.png',
    title: '季節限定',
    description: '當季新鮮食材'
  }
]

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      playOnInit: true
    })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })

    // 監聽滑鼠離開事件來重新啟動自動播放
    const handleMouseLeave = () => {
      plugin.current.play()
    }

    const root = api.rootNode()
    root.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      root.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [api])

  return (
    <section className="relative flex items-center justify-center px-[8vw] py-8 text-[#5C4B51] bg-[url('/story.png')] bg-cover bg-center">
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full max-w-2xl h-1/2"
        opts={{
          align: 'center',
          loop: true
        }}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative w-full h-full bg-[#FFF8E7]/80">
                <Image
                  src={image.src}
                  alt={image.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-contain"
                  priority={image.id === 1}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <h2 className="text-2xl font-bold mb-1">{image.title}</h2>
                  <p className="text-base">{image.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                current === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
