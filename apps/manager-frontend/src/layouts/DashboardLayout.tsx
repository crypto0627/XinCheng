'use client'

import { ReactNode, useState } from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="flex-1 bg-orange-50">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
