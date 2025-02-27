import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="bg-tgi-red text-tgi-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            <Image 
              src="/logo.png" 
              width={120} 
              height={40} 
              alt="星橙輕食餐盒" 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/menu" className="hover:text-tgi-gray">
              菜單
            </Link>
            <Link href="/locations" className="hover:text-tgi-gray">
              門市據點
            </Link>
            <Link href="/about" className="hover:text-tgi-gray">
              關於我們
            </Link>
            <Link href="/contact" className="hover:text-tgi-gray">
              聯絡我們
            </Link>
          </div>
          <Button variant="outline" className="bg-tgi-white text-tgi-red hover:bg-tgi-gray">
            線上訂位
          </Button>
        </div>
      </div>
    </nav>
  )
}

