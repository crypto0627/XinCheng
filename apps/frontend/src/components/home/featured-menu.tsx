'use client'
import Image from 'next/image'

export default function FeaturedMenu() {
  const menuItems = [
    {
      id: 1,
      title: '餐盒菜單',
      image: '/home/menu.jpg',
      alt: '餐盒菜單'
    },
    {
      id: 2,
      title: '限定菜單',
      image: '/home/menu2.jpg',
      alt: '限定菜單'
    }
  ]

  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Menu 菜單</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="border-2 border-orange-500 rounded-lg overflow-hidden flex-1">
              <div className="bg-orange-500 text-white p-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <div className="p-4">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
