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
import { useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'

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

// 客戶留言假資料
const customerReviews = [
  { name: 'TINI KAS', review: '早上就有水煮餐盒很健康！清爽無負擔，全部水煮加胡麻醬', iconColor: 'text-orange-400' },
  { name: '翁霆鑑', review: '在網路短影音看到、就來試試！餐點現點現做、可以加官方賴@事先預約、在去取餐、可以減少現場等候時間。', iconColor: 'text-blue-400' },
  { name: 'Alice Cheung', review: '大竹一帶有健康餐盒真是太感動了！怎麼現在才發現🥹吃過好幾種口味 清爽健康沒負擔，手打漢堡配料實在好美味', iconColor: 'text-green-400' },
  { name: 'Jessica Yuan', review: '這麼早就有健康餐可以買 太感動了 而且是好吃的！', iconColor: 'text-amber-500' },
  { name: 'Wen chen', review: '星橙給人的感覺是環境清潔、衛生，闆娘個人也是注重衛生的人，餐盒更是新鮮、用心，完全符合對外食感到油膩', iconColor: 'text-orange-500' },
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

  const reviewTrackRef = useRef<HTMLDivElement>(null);

  // 滑鼠/觸控暫停動畫
  const handlePause = () => {
    if (reviewTrackRef.current) {
      reviewTrackRef.current.style.animationPlayState = 'paused';
    }
  };
  const handleResume = () => {
    if (reviewTrackRef.current) {
      reviewTrackRef.current.style.animationPlayState = 'running';
    }
  };

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
      className="relative flex flex-col items-center justify-center px-[8vw] py-16 text-[#5C4B51] mt-10"
      aria-label="首頁輪播圖"
    >
      {/* 外層加上 rounded-3xl，讓 Carousel 整體有圓角，並固定高度寬度 */}
      <div className="w-full max-w-2xl h-[320px] relative z-10 rounded-3xl overflow-hidden">
        <Carousel
          plugins={[plugin.current]}
          setApi={setApi}
          className="w-full h-full"
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
                  {/* 固定圖片容器大小，防止圖片大小不一導致圓角失效 */}
                  <div className="relative w-full h-[320px] bg-[#FFF8E7]/80 rounded-3xl overflow-hidden flex items-center justify-center">
                    <Image
                      src={image.src}
                      alt={image.title}
                      width={500}
                      height={320}
                      className={`w-full h-full object-cover transition-opacity duration-300 rounded-3xl ${
                        loadedImages[image.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      priority={index <= 1}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 700px"
                      loading={index <= 1 ? "eager" : "lazy"}
                      quality={90}
                      onLoad={() => handleImageLoad(image.id)}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-3xl">
                      <h2 className="text-2xl font-bold mb-1">{image.title}</h2>
                      <p className="text-base">{image.description}</p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious aria-label="上一張" />
          <CarouselNext aria-label="下一張" /> */}
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
      </div>

      {/* 客戶留言輪播 - 獨立於主內容區塊外，以實現全寬顯示 */}
      <div className="w-full pt-16">
        <p className="text-orange-800 text-base mb-8 uppercase tracking-wider font-bold text-center">
          Google Map留言
        </p>
        <div className="relative w-full overflow-x-hidden">
          <div
            className="logo-carousel-track flex gap-x-8 md:gap-x-12"
            ref={reviewTrackRef}
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
          >
            {[...customerReviews, ...customerReviews].map((item, index) => (
              <div
                key={index}
                className="w-[320px] md:w-[480px] flex-shrink-0 bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE5B4] border border-[color:var(--border)] rounded-3xl shadow-xl px-8 py-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 cursor-pointer group relative hover:scale-[1.025]"
                style={{
                  minHeight: 200,
                  boxShadow: '0 6px 32px 0 rgba(255, 169, 77, 0.10), 0 1.5px 8px 0 rgba(60, 60, 60, 0.06)'
                }}
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="relative">
                    <div className="bg-gradient-to-tr from-amber-200/80 via-white to-amber-100/80 rounded-full p-1 shadow-md">
                      <User
                        className={`w-14 h-14 rounded-full border-2 border-amber-300 shadow object-cover group-hover:scale-110 transition-transform bg-white p-2 ${item.iconColor}`}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 bg-gradient-to-tr from-amber-400 to-orange-400 text-white text-[10px] px-2 py-0.5 rounded-full shadow font-semibold border border-white transform translate-x-1/2 translate-y-1/2">
                      五星好評
                    </span>
                  </div>
                  <div className="mt-2 font-bold text-amber-700 text-base flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full shadow"></span>
                    {item.name}
                  </div>
                </div>
                <div className="relative flex-1 flex flex-col justify-center w-full">
                  <p className="text-amber-800 text-[16px] leading-relaxed font-medium px-2 z-10 relative">
                    {item.review}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* 左右漸層遮罩，讓輪播更有層次 */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 md:w-16 bg-gradient-to-r from-white/90 to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 md:w-16 bg-gradient-to-l from-white/90 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  )
}
