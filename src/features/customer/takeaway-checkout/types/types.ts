export type TakeawayOrder = {
  orderId: string
  orderNumber: string
  status: string
  paymentStatus: string | null
  checkoutUrl: string | null
  pickupCode: string | null
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

export type TakeawayOrderRequest = {
  cartId: string
  cartVersion: string
  pickupName: string
  pickupPhone: string
}
