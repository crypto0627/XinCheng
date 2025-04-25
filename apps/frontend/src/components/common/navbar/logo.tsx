import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 transition-opacity hover:opacity-80"
    >
      <div className="rounded-full overflow-hidden w-12 h-12 border-2 border-orange-100">
        <Image
          src="/logo.webp"
          width={100}
          height={40}
          alt="星橙輕食餐盒"
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <span className="text-xl font-medium text-orange-600">星橙</span>
    </Link>
  )
}