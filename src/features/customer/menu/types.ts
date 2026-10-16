// Presentation model; independent of the future backend contract.
export type Dish = {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
  tag?: string
  vegetarian?: boolean
  spicy?: boolean
  available: boolean
  minutes: number
  ingredients: string
}
