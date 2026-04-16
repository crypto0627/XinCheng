import Link from 'next/link'
import { navLinks } from './nav-links'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <div
      className={`md:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-96' : 'max-h-0'
      }`}
    >
      <div className="flex flex-col space-y-4 pb-6">
        {navLinks.map(({ label, href, external }) => (
          <Link
            key={label}
            href={href}
            {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
            onClick={onClose}
            className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
