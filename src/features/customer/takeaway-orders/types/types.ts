export type TakeawayOrderSummary = {
  orderId: string
  restaurantId: string | null
  restaurantName: string | null
  status: string
  paymentStatus: string | null
  totalAmount: number
  createdAt: string
  items: TakeawayOrderItem[]
}

export type TakeawayOrderItem = {
  orderItemId: string
  nameSnapshot: string
  imageUrl?: string | null
  quantity: number
  lineTotal: number
  options: { optionId: string; name: string; quantity: number }[]
}
export type TakeawayOrdersPage = {
  items: TakeawayOrderSummary[]
  totalCount: number
  page: number
  pageSize: number
}
