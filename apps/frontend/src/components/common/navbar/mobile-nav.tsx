import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  return (
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
          href="https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816"
          target="_blank"
          onClick={() => setIsOpen(false)}
          className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
        >
          聯絡我們
        </Link>
      </div>
    </div>
  )
} 