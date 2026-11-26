// Legacy payment preview only; real orders use order-tracking/types/types.ts.
import type { CartItem } from '../cart/types/types'
import type { PaymentMethod } from './types'

export type PreviewOrder = {
  id: string
  items: CartItem[]
  createdAt: string
  paymentRequested: boolean
  method: PaymentMethod | null
}
