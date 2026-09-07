// Local cart model, not the backend order contract.
export type CartItem = {
  id: string
  dishId: string
  name: string
  quantity: number
  unitPrice: number
  note: string
}
export type CartState = { items: CartItem[] }
