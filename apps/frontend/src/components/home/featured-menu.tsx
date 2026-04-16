import Image from 'next/image'

const menuItems = [
  {
    id: 1,
    title: '餐盒菜單',
    image: '/home/xincheng-menu.webp',
    alt: '餐盒菜單',
    width: 902,
    height: 1280
  },
  {
    id: 2,
    title: '限定菜單',
    image: '/home/xincheng-menu2.webp',
    alt: '限定菜單',
    width: 910,
    height: 1280
  }
] as const

export default function FeaturedMenu() {
  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-800">
          Menu 菜單
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="border-2 border-orange-500 rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-105"
            >
              <div className="bg-orange-500 text-white p-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <Image
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="w-full h-auto block"
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
