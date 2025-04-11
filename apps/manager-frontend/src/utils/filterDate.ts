import { Order } from '@/types'

export class OrderFilter {
  private orders: Order[]
  private now: Date
  private todayStr: string
  private currentYear: number
  private currentMonth: number
  private currentQuarter: number

  constructor(orders: Order[]) {
    this.orders = orders
    this.now = new Date()
    this.todayStr = this.formatDate(this.now)
    this.currentYear = this.now.getFullYear()
    this.currentMonth = this.now.getMonth() + 1
    this.currentQuarter = Math.ceil(this.currentMonth / 3)
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
  }

  private parseDate(dateStr: string): {
    year: number
    month: number
    day: number
  } {
    const [year, month, day] = dateStr.split(' ')[0].split('/').map(Number)
    return { year, month, day }
  }

  public filterByToday(): Order[] {
    return this.orders.filter((order) =>
      order.createdAt.startsWith(this.todayStr),
    )
  }

  public filterByMonth(): Order[] {
    return this.orders.filter((order) => {
      const { year, month } = this.parseDate(order.createdAt)
      return year === this.currentYear && month === this.currentMonth
    })
  }

  public filterByQuarter(): Order[] {
    return this.orders.filter((order) => {
      const { year, month } = this.parseDate(order.createdAt)
      const orderQuarter = Math.ceil(month / 3)
      return year === this.currentYear && orderQuarter === this.currentQuarter
    })
  }

  public filterByYear(): Order[] {
    return this.orders.filter((order) =>
      order.createdAt.startsWith(`${this.currentYear}/`),
    )
  }
}
