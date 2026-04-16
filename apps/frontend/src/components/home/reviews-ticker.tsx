'use client'

import { useRef } from 'react'
import { User } from 'lucide-react'

interface Review {
  name: string
  review: string
  iconColor: string
}

const reviews: Review[] = [
  {
    name: 'TINI KAS',
    review: '早上就有水煮餐盒很健康！清爽無負擔，全部水煮加胡麻醬',
    iconColor: 'text-orange-400'
  },
  {
    name: '翁霆鑑',
    review:
      '在網路短影音看到、就來試試！餐點現點現做、可以加官方賴@事先預約、在去取餐、可以減少現場等候時間。',
    iconColor: 'text-blue-400'
  },
  {
    name: 'Alice Cheung',
    review:
      '大竹一帶有健康餐盒真是太感動了！怎麼現在才發現🥹吃過好幾種口味 清爽健康沒負擔，手打漢堡配料實在好美味',
    iconColor: 'text-green-400'
  },
  {
    name: 'Jessica Yuan',
    review: '這麼早就有健康餐可以買 太感動了 而且是好吃的！',
    iconColor: 'text-amber-500'
  },
  {
    name: 'Wen chen',
    review:
      '星橙給人的感覺是環境清潔、衛生，闆娘個人也是注重衛生的人，餐盒更是新鮮、用心，完全符合對外食感到油膩',
    iconColor: 'text-orange-500'
  }
]

export function ReviewsTicker() {
  const trackRef = useRef<HTMLDivElement>(null)

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  return (
    <div className="w-full pt-16">
      <p className="text-orange-800 text-base mb-8 uppercase tracking-wider font-bold text-center">
        Google Map留言
      </p>
      <div className="relative w-full overflow-x-hidden">
        <div
          ref={trackRef}
          className="logo-carousel-track flex gap-x-8 md:gap-x-12"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {[...reviews, ...reviews].map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="w-[320px] md:w-[480px] flex-shrink-0 bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE5B4] border border-border rounded-3xl shadow-xl px-8 py-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 cursor-pointer group relative hover:scale-[1.025]"
              style={{
                minHeight: 200,
                boxShadow:
                  '0 6px 32px 0 rgba(255, 169, 77, 0.10), 0 1.5px 8px 0 rgba(60, 60, 60, 0.06)'
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
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full shadow" />
                  {item.name}
                </div>
              </div>
              <p className="text-amber-800 text-[16px] leading-relaxed font-medium px-2">
                {item.review}
              </p>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 md:w-16 bg-gradient-to-r from-white/90 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 md:w-16 bg-gradient-to-l from-white/90 to-transparent z-10" />
      </div>
    </div>
  )
}
