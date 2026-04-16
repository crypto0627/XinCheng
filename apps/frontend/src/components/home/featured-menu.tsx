import Image from 'next/image'

const menuItems = [
  {
    id: 1,
    title: '餐盒菜單',
    image: '/home/xincheng-menu.webp',
    alt: '餐盒菜單'
  },
  {
    id: 2,
    title: '限定菜單',
    image: '/home/xincheng-menu2.webp',
    alt: '限定菜單'
  }
] as const

export default function FeaturedMenu() {
  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-800">
          Menu 菜單
        </h2>

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
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
