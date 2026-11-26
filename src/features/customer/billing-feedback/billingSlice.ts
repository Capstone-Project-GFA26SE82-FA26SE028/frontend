import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { previewInvoice } from './data/previewInvoice'
import { feedbackSchema } from './schemas/feedbackSchema'
import type { Invoice, InvoiceFeedback } from './types'
import type { PreviewOrder } from '../payment/previewOrderTypes'
import type { PaymentMethod } from '../payment/types'

type BillingState = {
  invoices: Invoice[]
  feedback: Record<string, InvoiceFeedback>
}

const initialState: BillingState = { invoices: [previewInvoice], feedback: {} }

const billingSlice = createSlice({
  name: 'customerBilling',
  initialState,
  reducers: {
    completePreviewPayment(
      state,
      {
        payload,
      }: PayloadAction<{
        id: string
        createdAt: string
        method: PaymentMethod
        orders: PreviewOrder[]
      }>,
    ) {
      const billedIds = new Set(
        state.invoices.flatMap((invoice) => invoice.orderIds ?? []),
      )
      const unbilledOrders = payload.orders.filter(
        (order) => !billedIds.has(order.id),
      )
      const targetOrders = unbilledOrders.length
        ? unbilledOrders
        : payload.orders
      const items = targetOrders.flatMap((order) => order.items)
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      )
      const tax = Math.round(subtotal * 0.08)
      const serviceFee = Math.round(subtotal * 0.05)
      const invoice: Invoice = {
        id: payload.id,
        code: `HD-${payload.createdAt.slice(0, 10).replace(/-/g, '')}-${payload.id.slice(0, 4).toUpperCase()}`,
        tableName: 'Bàn T-03',
        issuedAt: payload.createdAt,
        paidAt: payload.createdAt,
        status: 'PAID',
        method: payload.method,
        items,
        subtotal,
        tax,
        serviceFee,
        discount: 0,
        total: subtotal + tax + serviceFee,
        isPreview: true,
        orderIds: targetOrders.map((order) => order.id),
      }
      state.invoices.unshift(invoice)
    },
    submitFeedback(
      state,
      {
        payload,
      }: PayloadAction<{
        invoiceId: string
        rating: number
        comment?: string
        createdAt?: string
      }>,
    ) {
      const parsed = feedbackSchema.safeParse(payload)
      if (!parsed.success) return
      state.feedback[payload.invoiceId] = {
        invoiceId: payload.invoiceId,
        rating: parsed.data.rating,
        comment: parsed.data.comment?.trim() ?? '',
        createdAt: payload.createdAt ?? new Date().toISOString(),
      }
    },
  },
})

export const { completePreviewPayment, submitFeedback } = billingSlice.actions
export default billingSlice.reducer
