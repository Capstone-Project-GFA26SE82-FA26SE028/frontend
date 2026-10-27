import type { CartItem } from '../cart/types/types'

export type Invoice = {
  id: string
  code: string
  tableName: string
  issuedAt: string
  paidAt: string | null
  status: 'PENDING' | 'PAID'
  method: 'cash' | 'bank' | null
  items: CartItem[]
  subtotal: number
  tax: number
  serviceFee: number
  discount: number
  total: number
  isPreview: boolean
  orderIds?: string[]
}

export type InvoiceFeedback = {
  invoiceId: string
  rating: number
  comment: string
  createdAt: string
}
