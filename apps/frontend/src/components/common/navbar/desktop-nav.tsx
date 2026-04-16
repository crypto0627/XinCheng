import Link from 'next/link'
import { navLinks } from './nav-links'

export function DesktopNav() {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map(({ label, href, external }) => (
        <Link
          key={label}
          href={href}
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
          className="relative group underline-anim"
        >
          <span className="text-orange-500 hover:text-orange-600 transition-colors duration-200">
            {label}
          </span>
        </Link>
      ))}
    </div>
  )
}
