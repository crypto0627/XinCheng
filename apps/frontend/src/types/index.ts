export type FeaturedItem = {
  id: number
  name: string
  type: string
  image: string
  description: string
  calories: number
  nutrition: {
    carbs: number
    protein: number
    fat: number
  }
  price: number
}
