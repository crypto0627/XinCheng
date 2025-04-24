'use client'

import * as React from 'react'
import Image from 'next/image'

const menuCategories = [
  {
    id: 1,
    name: '健康餐盒',
    description: '高蛋白低脂肪，健身愛好者的首選',
    image: '/home/health-box.webp',
    width: 800,
    height: 600
  },
  {
    id: 2,
    name: '沙拉',
    description: '適合正在減脂和享受健康的朋友',
    image: '/home/salad.webp',
    width: 800,
    height: 600
  },
  {
    id: 3,
    name: '吐司',
    description: '現烤吐司搭配新鮮的食材，開啟美好的一天',
    image: '/home/toast.webp',
    width: 800,
    height: 600
  },
  {
    id: 4,
    name: '漢堡',
    description: '份量十足，一口下去滿滿的肉汁',
    image: '/home/burger.webp',
    width: 800,
    height: 600
  }
]

export default function BrunchSection() {
  return (
    <section id="brunch" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#5C4B51] mb-4">精選輕食餐盒</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我們精心準備的健康輕食餐盒，每一份都充滿營養與美味，讓您享受美食的同時保持健康
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {menuCategories.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    className="object-cover"
                    priority
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      inset: 0
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#5C4B51] mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}
