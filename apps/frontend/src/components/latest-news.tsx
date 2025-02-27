import { Button } from "@/components/ui/button"

const newsItems = [
  {
    id: 1,
    title: "夏日特別菜單上市",
    content: "清爽消暑的夏日特別菜單現已推出，快來品嚐吧！",
    date: "2023-06-01",
  },
  {
    id: 2,
    title: "週年慶優惠活動",
    content: "慶祝我們開業一週年，全店餐點享8折優惠！",
    date: "2023-05-15",
  },
]

export default function LatestNews() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">最新消息與優惠</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-tgi-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{item.date}</span>
                <Button variant="outline" className="text-tgi-red border-tgi-red hover:bg-tgi-red hover:text-white">
                  了解更多
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

