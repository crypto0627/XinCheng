"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"

const images = [
  {
    id: 1,
    src: "/image.png",
    title: "美味早午餐",
    description: "開啟美好的一天"
  },
  {
    id: 2, 
    src: "/logo.png",
    title: "週末限定特餐", 
    description: "豐盛的假日饗宴"
  },
  {
    id: 3,
    src: "/logo.png",
    title: "健康輕食選擇",
    description: "均衡營養的美味"
  },
  {
    id: 4,
    src: "/logo.png",
    title: "精選套餐",
    description: "多樣化的美食選擇"
  },
  {
    id: 5,
    src: "/logo.png",
    title: "季節限定",
    description: "當季新鮮食材"
  }
]

export default function HeroCarousel() {
  return (
    <section className="relative flex items-end gap-12 px-[8vw] py-32 text-[#5C4B51] bg-[url('/story.png')] bg-cover bg-center">
      <Swiper
        modules={[EffectCoverflow, Pagination, Autoplay]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: true
        }}
        loop={true}
        lazyPreloadPrevNext={5}
        className="w-full h-[50vh]"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full bg-[#FFF8E7]/80">
              <Image
                src={image.src}
                alt={image.title}
                width={1920}
                height={1080}
                className="w-full h-full object-contain"
                priority={image.id === 1}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                <h2 className="text-4xl font-bold mb-2">{image.title}</h2>
                <p className="text-xl">{image.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
