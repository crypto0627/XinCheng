'use client'
import Image from 'next/image'

export default function FeaturedMenu() {
  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Menu 菜單</h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="border-2 border-orange-500 rounded-lg overflow-hidden flex-1">
            <div className="bg-orange-500 text-white p-3">
              <h3 className="text-xl font-semibold">餐盒菜單</h3>
            </div>
            <div className="p-4">
              <Image
                src="/home/menu.jpg"
                alt="餐盒菜單"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="border-2 border-orange-500 rounded-lg overflow-hidden flex-1">
            <div className="bg-orange-500 text-white p-3">
              <h3 className="text-xl font-semibold">限定菜單</h3>
            </div>
            <div className="p-4">
              <Image
                src="/home/menu2.jpg"
                alt="限定菜單"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
