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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-sm shadow-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Logo />
          <DesktopNav />
          <div className="flex items-center space-x-4">
            <OrderMenu />
            <MobileMenuButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
          </div>
        </div>
        <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </nav>
  )
}
