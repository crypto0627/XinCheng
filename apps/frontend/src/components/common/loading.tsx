import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-tgi-red border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="星橙 Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-black font-bold text-3xl">Loading...</div>
      </div>
    </div>
  )
}
