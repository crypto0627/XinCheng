'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              width={100}
              height={40}
              alt="星橙輕食餐盒"
              className="h-12 w-auto object-contain"
              priority
            />
            <span className="text-xl font-medium text-orange-600">星橙</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#menu" className="relative group">
              <span className="text-gray-700 hover:text-orange-600 transition-colors duration-200">
                菜單介紹
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7"
              target="_blank"
              className="relative group"
            >
              <span className="text-gray-700 hover:text-orange-600 transition-colors duration-200">
                門市據點
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="relative group">
              <span className="text-gray-700 hover:text-orange-600 transition-colors duration-200">
                關於我們
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/pre-order" className="relative group">
              <span className="text-gray-700 hover:text-orange-600 transition-colors duration-200">
                團購預訂
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="https://www.facebook.com/people/%E6%98%9F%E6%A9%99-%E8%BC%95%E9%A3%9F%E5%92%96%E5%95%A1/100093377431697/"
              target="_blank"
              className="relative group"
            >
              <span className="text-gray-700 hover:text-orange-600 transition-colors duration-200">
                聯絡我們
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="default"
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

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="flex flex-col space-y-4 pb-6">
            <Link
              href="/#menu"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              菜單介紹
            </Link>
            <Link
              href="https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              門市據點
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              關於我們
            </Link>
            <Link
              href="/pre-order"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              團購預訂
            </Link>
            <Link
              href="https://www.facebook.com/people/%E6%98%9F%E6%A9%99-%E8%BC%95%E9%A3%9F%E5%92%96%E5%95%A1/100093377431697/"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              聯絡我們
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
