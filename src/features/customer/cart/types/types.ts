export type CartOption = { optionId: string; quantity: number }
export type CartLine = {
  itemId: string
  quantity: number
  note: string | null
  options: CartOption[]
}
export type QuotedOption = {
  optionId: string
  name: string
  quantity: number
  extraPrice: number
}
export type QuotedItem = {
  itemId: string
  name: string
  quantity: number
  unitPrice: number
  options: QuotedOption[]
}
export type CartQuote = {
  isValid: boolean
  message: string
  evaluatedAt: string
  totalAmount: number | null
  items: QuotedItem[]
  errors: { lineIndex: number; code: string; message: string }[]
}
export type CustomerCart = {
  cartId: string
  tableSessionId: string
  expiresAt: string
  version: string
  items: CartLine[]
  quote: CartQuote | null
}
export type CartResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type CartAction =
  | { kind: 'add'; line: CartLine }
  | { kind: 'edit'; index: number; line: CartLine; version: string }
  | { kind: 'quantity'; index: number; quantity: number; version: string }
  | { kind: 'remove'; index: number; version: string }
  | { kind: 'clear'; version: string }

// Presentation model retained by order/invoice preview screens until they use API data.
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

export type CartEditTarget = { index: number; line: CartLine; version: string }
