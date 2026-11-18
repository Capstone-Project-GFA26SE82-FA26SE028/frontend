export type TakeawayCartLine = {
  itemId: string
  quantity: number
  note: string | null
  options: { optionId: string; quantity: number }[]
}

export type TakeawayCart = {
  restaurantId: string | null
  cartId: string
  tableSessionId: string | null
  expiresAt: string
  version: string
  items: TakeawayCartLine[]
  quote: {
    isValid: boolean
    message: string
    evaluatedAt: string
    totalAmount: number | null
    items: {
      itemId: string
      name: string
      quantity: number
      unitPrice: number
      options: {
        optionId: string
        name: string
        quantity: number
        extraPrice: number
      }[]
    }[]
    errors: { lineIndex: number; code: string; message: string }[]
  } | null
}

export type TakeawayCartResponse = {
  isSuccess: boolean
  message?: string | null
  result: TakeawayCart
}

export type TakeawayCartEditTarget = {
  index: number
  version: string
  line: TakeawayCartLine
}
