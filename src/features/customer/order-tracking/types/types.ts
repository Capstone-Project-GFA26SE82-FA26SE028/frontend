export type CustomerOrder = {
  orderId: string
  orderNumber: string
  tableSessionId: string
  channel: string
  source: string
  status: string
  version: string
  createdBy: string | null
  createdAt: string
  confirmedBy: string | null
  confirmedAt: string | null
  totalAmount: number
  items: OrderLine[]
}

export type OrderLine = {
  orderItemId: string
  itemId: string
  recipeVersionId: string | null
  nameSnapshot: string
  quantity: number
  unitPriceSnapshot: number
  lineTotal: number
  note: string | null
  status: string
  options: {
    optionId: string
    name: string
    quantity: number
    extraPrice: number
  }[]
}

export type OrderResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
