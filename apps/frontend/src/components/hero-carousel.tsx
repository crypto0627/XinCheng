"use client"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const carouselItems = [
  {
    id: 1,
    image: "/hero-1.jpg",
    title: "美味早午餐",
    description: "開啟美好的一天",
  },
  {
    id: 2,
    image: "/hero-2.jpg",
    title: "週末限定特餐",
    description: "豐盛的假日饗宴",
  },
  {
    id: 3,
    image: "/hero-3.jpg",
    title: "健康輕食選擇",
    description: "均衡營養的美味",
  },
]

export default function HeroCarousel() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {carouselItems.map((item) => (
          <CarouselItem key={item.id}>
            <div className="relative h-[60vh]">
              <Image src={item.image || "/placeholder.svg"} alt={item.title} layout="fill" objectFit="cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h2>
                  <p className="text-xl md:text-2xl">{item.description}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

