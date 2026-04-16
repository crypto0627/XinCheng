export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export const navLinks: NavLink[] = [
  { label: '菜單介紹', href: '/#menu' },
  {
    label: '門市據點',
    href: 'https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7',
    external: true
  },
  { label: '關於我們', href: '/about' },
  {
    label: '聯絡我們',
    href: 'https://line.me/R/ti/p/@376omnxd?oat_content=url&ts=06010816',
    external: true
  }
]
