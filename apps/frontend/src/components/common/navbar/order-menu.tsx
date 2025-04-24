import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function OrderMenu() {
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="default"
        aria-label='order-menu'
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
      >
        立即點餐
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOrderMenuOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOrderMenuOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 flex flex-col gap-2 items-center"
          onMouseLeave={() => setIsOrderMenuOpen(false)}
        >
          <Link
            href="https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816"
            target="_blank"
            className="flex items-center px-4 py-2 hover:bg-orange-50 transition-colors"
          >
            加入 Line 好友點餐
          </Link>
          <Link
            href="https://www.foodpanda.com.tw/restaurant/c7qa/xing-cheng-qing-shi-can-he?utm_source=google&utm_medium=organic&utm_campaign=google_reserve_place_order_action"
            target="_blank"
            className="flex items-center px-4 py-2 hover:bg-orange-50 transition-colors"
          >
            Foodpanda 訂餐
          </Link>
          <Link
            href="https://www.ubereats.com/tw/store/%E6%98%9F%E6%A9%99%E8%BC%95%E9%A3%9F%E9%A4%90%E7%9B%92/NXwSuRgRVXC8x62kA9WKKg?diningMode=PICKUP&utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas"
            target="_blank"
            className="flex items-center px-4 py-2 hover:bg-orange-50 transition-colors"
          >
            UberEats 訂餐
          </Link>
        </div>
      )}
    </div>
  )
} 