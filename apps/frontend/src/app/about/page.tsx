import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="pt-24 bg-[#FFF8E7]">
      <div className="container mx-auto px-4">
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
                src="/store-front.jpg"
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

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-orange-600 mb-12">
            我們的特色
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">
                新鮮食材
              </h3>
              <p className="text-gray-600">
                每日嚴選新鮮蔬果，與在地小農合作，確保食材的品質與新鮮度。
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">
                健康料理
              </h3>
              <p className="text-gray-600">
                堅持少油少鹽的烹調方式，保留食材原味，為您的健康把關。
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">
                用心服務
              </h3>
              <p className="text-gray-600">
                親切的服務團隊，讓每位顧客都能感受到星橙的溫暖與用心。
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-orange-600 mb-12">
            我們的承諾
          </h2>
          <div className="max-w-3xl mx-auto text-gray-700">
            <p className="text-lg leading-relaxed text-center">
              星橙承諾持續為您提供優質的餐點與服務，讓每一個平凡的日常都能充滿美味與健康的驚喜。我們期待能成為您生活中不可或缺的美食夥伴，一同創造健康美好的飲食生活。
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
