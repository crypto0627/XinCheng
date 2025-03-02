"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState } from "react"
import { featuredItems } from "@/contents"

export default function FeaturedMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("健康餐")

  const categoryRanges = {
    "健康餐": [1, 10],
    "西式早餐": [11, 19], 
    "飲料": [20, 29],
    "單點": [30, 40]
  }
  const filteredItems = featuredItems.filter(item => {
    const [min, max] = categoryRanges[selectedCategory as keyof typeof categoryRanges]
    return item.id >= min && item.id <= max
  })

  return (
    <section id="menu" className="py-20 bg-tgi-gray overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Menu 菜單</h2>
        
        <div className="flex justify-center gap-4 mb-8">
          {Object.keys(categoryRanges).map((category) => (
            <Button
              key={category}
              variant="outline"
              className={`bg-orange-500 text-white hover:bg-orange-600 hover:text-white/80 hover:scale-105 transition-all duration-300 ${
                selectedCategory === category ? 'ring-2 ring-orange-300' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {Array.from({ length: Math.ceil(filteredItems.length / 6) }).map((_, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filteredItems.slice(index * 6, (index + 1) * 6).map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="text-sm">
                            <p className="text-orange-500 font-semibold">${item.price}</p>
                            <p className="text-gray-500">{item.calories} 卡路里</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            <p>蛋白質 {item.nutrition.protein}g</p>
                            <p>碳水 {item.nutrition.carbs}g</p>
                            <p>脂肪 {item.nutrition.fat}g</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-orange-500 text-white hover:bg-orange-600 hover:text-white/80 hover:scale-125 transition-all duration-300" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-orange-500 text-white hover:bg-orange-600 hover:text-white/80 hover:scale-125 transition-all duration-300" />
        </Carousel>
      </div>
    </section>
  )
}
