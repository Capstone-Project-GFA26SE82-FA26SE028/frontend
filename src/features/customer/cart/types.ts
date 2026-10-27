export type CartItem = {
  id: string
  dishId: string
  name: string
  quantity: number
  unitPrice: number
  note: string
  image: string
  tableSessionId?: string
  priceId?: string | null
  optionSelections?: { optionGroupId: string; optionIds: string[] }[]
  option: string
}
export type CartState = { items: CartItem[] }
