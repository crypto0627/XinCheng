'use client'

import { BarChart, LayoutDashboard, MenuSquare, Receipt } from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    {
      href: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
      text: '總覽'
    },
    {
      href: '/menu',
      icon: <MenuSquare className="w-5 h-5" />,
      text: '菜單管理'
    },
    {
      href: '/orders',
      icon: <Receipt className="w-5 h-5" />,
      text: '訂單管理'
    },
    {
      href: '/reports',
      icon: <BarChart className="w-5 h-5" />,
      text: '財務報表'
    }
  ]

  return (
    <>
      <div
        className={`fixed h-full w-[250px] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="星橙輕食餐盒 Logo"
              width={150}
              height={50}
              priority
            />
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-50 z-10 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}
