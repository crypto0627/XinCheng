import Image from 'next/image'

export function AboutIntro() {
  return (
    <section className="py-16">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">
        關於星橙
      </h1>
      <div className="max-w-3xl mx-auto text-gray-700 space-y-6">
        <p className="text-lg leading-relaxed">
          星橙輕食餐盒源於一個簡單而溫暖的理念 -
          為忙碌的都市人提供健康美味的餐點選擇。我們相信，即使在快節奏的生活中，也應該能夠享受到營養均衡且美味的餐食。
        </p>
        <div className="relative h-80 rounded-xl overflow-hidden my-8">
          <Image
            src="/store.webp"
            alt="星橙店面"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-lg leading-relaxed">
          成立於2023年，星橙以「健康、美味、便利」為核心價值，精心挑選新鮮食材，每天手工製作多款輕食餐盒。我們的主廚團隊不斷創新，結合在地食材與健康理念，為顧客帶來豐富多樣的餐點選擇。
        </p>
      </div>
    </section>
  )
}
