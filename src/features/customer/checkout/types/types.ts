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

export type { CustomerOrder as SubmittedOrder } from '../../order-tracking/types/types'
