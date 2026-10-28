// Legacy payment preview only; real orders use order-tracking/types/types.ts.
import type { CartItem } from '../cart/types/types'
export type PreviewOrder = {
  id: string
  items: CartItem[]
  createdAt: string
  paymentRequested: boolean
  method: 'cash' | 'bank' | null
}
