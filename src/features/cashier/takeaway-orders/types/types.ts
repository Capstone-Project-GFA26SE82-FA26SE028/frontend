export type CashierTakeawayOrder = {
  orderId: string
  orderNumber: string
  status: string
  paymentStatus: string | null
  version: string
  cancellationRequested: boolean
  pickupName: string | null
  pickupPhone: string | null
  createdAt: string
  totalAmount: number
  items: {
    orderItemId: string
    nameSnapshot: string
    quantity: number
    lineTotal: number
    note: string | null
    options: { optionId: string; name: string; quantity: number }[]
  }[]
}
