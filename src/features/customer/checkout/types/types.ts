export type CheckoutRequest = {
  cartId: string
  cartVersion: string
  tableId: string
  channel: 'DineIn'
  items: []
}

export type CheckoutAttempt = {
  key: string
  request: CheckoutRequest
}

export type SubmittedOrder = {
  orderId: string
  orderNumber: string
  tableSessionId: string
  status: string
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
