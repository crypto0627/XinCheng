import Image from "next/image"
import { Button } from "@/components/ui/button"

const featuredItems = [
  {
    id: 1,
    name: "班尼迪克蛋",
    image: "/benedict.jpg",
    description: "嫩煎的英式瑪芬麵包，搭配水波蛋和荷蘭醬",
  },
  {
    id: 2,
    name: "酪梨吐司",
    image: "/avocado-toast.jpg",
    description: "新鮮酪梨搭配全麥吐司，營養美味的早餐選擇",
  },
  {
    id: 3,
    name: "法式吐司",
    image: "/french-toast.jpg",
    description: "香脆可口的法式吐司，淋上楓糖漿，美味無比",
  },
]

export default function FeaturedMenu() {
  return (
    <section className="py-12 bg-tgi-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">特色菜單</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" className="w-full">
                  查看詳情
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

