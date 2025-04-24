'use client'
import { LazyImage } from '@/components/ui/lazy-image'
import { useState } from 'react'

export default function FeaturedMenu() {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
  
  const menuItems = [
    {
      id: 1,
      title: '餐盒菜單',
      image: '/home/menu.webp',
      alt: '餐盒菜單'
    },
    {
      id: 2,
      title: '限定菜單',
      image: '/home/menu2.webp',
      alt: '限定菜單'
    }
  ]
  
  // 處理圖片載入完成事件
  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }))
  }

  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Menu 菜單</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="border-2 border-orange-500 rounded-lg overflow-hidden flex-1 transform transition-transform duration-500 hover:scale-105"
            >
              <div className="bg-orange-500 text-white p-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <div className="p-4 relative min-h-[200px]">
                {/* 使用 LazyImage 組件 */}
                <LazyImage
                  src={item.image}
                  alt={item.alt}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover"
                  threshold={0.2}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoadingComplete={() => handleImageLoad(item.id)}
                />
                
                {/* 載入動畫 */}
                {!loadedImages[item.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
