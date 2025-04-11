import Link from 'next/link'

export function DesktopNav() {
  return (
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
        href="https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816"
        target="_blank"
        className="relative group"
      >
        <span className="text-gray-700 hover:text-orange-600 transition-colors duration-200">
          聯絡我們
        </span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </div>
  )
} 