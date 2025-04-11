interface Feature {
  title: string
  description: string
}

const features: Feature[] = [
  {
    title: '新鮮食材',
    description: '每日嚴選新鮮蔬果，與在地小農合作，確保食材的品質與新鮮度。'
  },
  {
    title: '健康料理',
    description: '堅持少油少鹽的烹調方式，保留食材原味，為您的健康把關。'
  },
  {
    title: '用心服務',
    description: '親切的服務團隊，讓每位顧客都能感受到星橙的溫暖與用心。'
  }
]

export function AboutFeatures() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-12">
        我們的特色
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
