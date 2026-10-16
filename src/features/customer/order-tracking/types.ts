// Model minh h?a cho giao di?n, ch?a ph?i contract backend.
import type { CartItem } from '../cart/types'
export type PreviewOrder = {
  id: string
  items: CartItem[]
  createdAt: string
  paymentRequested: boolean
  method: 'cash' | 'bank' | null
}
