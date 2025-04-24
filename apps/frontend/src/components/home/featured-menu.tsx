'use client'
import Image from 'next/image'

export default function FeaturedMenu() {
  const menuItems = [
    {
      id: 1,
      title: '餐盒菜單',
      image: '/home/menu.webp',
      alt: '餐盒菜單',
      width: 800,
      height: 400
    },
    {
      id: 2,
      title: '限定菜單',
      image: '/home/menu2.webp',
      alt: '限定菜單',
      width: 800,
      height: 400
    }
  ]

  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Menu 菜單</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="border-2 border-orange-500 rounded-lg overflow-hidden flex-1 transform transition-transform duration-500 hover:scale-105"
            >
              <div className="bg-orange-500 text-white p-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <div className="relative aspect-[2/1]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="object-cover"
                  quality={100}
                  priority
                  sizes="(max-width: 768px) 400px, 800px"
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
