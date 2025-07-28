import Link from 'next/link'

const navLinks = [
  {
    label: '菜單介紹',
    href: '/#menu',
  },
  {
    label: '門市據點',
    href: 'https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7',
    target: '_blank',
  },
  {
    label: '關於我們',
    href: '/about',
  },
  // {
  //   label: '團購預訂',
  //   href: '/login',
  // },
  {
    label: '聯絡我們',
    href: 'https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816',
    target: '_blank',
  },
]

export function DesktopNav() {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map(({ label, href, target }, idx) => (
        <Link
          key={label}
          href={href}
          {...(target ? { target } : {})}
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