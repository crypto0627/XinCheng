'use client'
import { useState } from 'react'
import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'
import { OrderMenu } from './order-menu'
import { Logo } from './logo'
import { MobileMenuButton } from './mobile-menu-button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--background)] backdrop-blur-sm shadow-md border-b border-[color:var(--border)] transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Logo />
          <DesktopNav />
          <div className="flex items-center space-x-4">
            <OrderMenu />
            <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
        <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </nav>
  )
} 