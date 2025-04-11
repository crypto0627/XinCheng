import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 transition-opacity hover:opacity-80"
    >
      <Image
        src="/logo.png"
        width={100}
        height={40}
        alt="星橙輕食餐盒"
        className="h-12 w-auto object-contain"
        priority
      />
      <span className="text-xl font-medium text-orange-600">星橙</span>
    </Link>
  )
} 