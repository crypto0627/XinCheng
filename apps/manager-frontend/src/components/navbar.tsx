'use client'

import { Bell, CircleUserRound, Menu } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface NavbarProps {
  toggleSidebar: () => void
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between">
        <button
          className="lg:hidden text-gray-600 hover:text-gray-900"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Bell className="w-6 h-6" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <CircleUserRound className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}
