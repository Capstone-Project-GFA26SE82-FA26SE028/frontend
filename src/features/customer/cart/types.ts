export type CartItem = {
  id: string
  dishId: string
  name: string
  quantity: number
  unitPrice: number
  note: string
  image: string
  option: string
}
export type CartState = { items: CartItem[] }
