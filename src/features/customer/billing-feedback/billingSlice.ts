import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { previewInvoice } from './data/previewInvoice'
import { feedbackSchema } from './schemas/feedbackSchema'
import type { Invoice, InvoiceFeedback } from './types'
import type { PreviewOrder } from '../order-tracking/types'

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
        method: 'cash' | 'bank'
        orders: PreviewOrder[]
      }>,
    ) {
      const billedIds = new Set(
        state.invoices.flatMap((invoice) => invoice.orderIds ?? []),
      )
      const orders = payload.orders.filter((order) => !billedIds.has(order.id))
      if (
        !orders.length ||
        state.invoices.some((invoice) => invoice.id === payload.id)
      )
        return
      const items = orders.flatMap((order) =>
        order.items.map((item) => ({ ...item, id: `${order.id}-${item.id}` })),
      )
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      )
      state.invoices.unshift({
        id: payload.id,
        code: `MOC-${payload.id.slice(0, 8).toUpperCase()}`,
        tableName: 'Bàn 08 · Không gian vườn',
        issuedAt: payload.createdAt,
        paidAt: payload.createdAt,
        status: 'PAID',
        method: payload.method,
        items,
        subtotal,
        tax: 0,
        serviceFee: 0,
        discount: 0,
        total: subtotal,
        isPreview: true,
        orderIds: orders.map((order) => order.id),
      })
    },
    submitFeedback(state, { payload }: PayloadAction<InvoiceFeedback>) {
      const invoice = state.invoices.find(
        (item) => item.id === payload.invoiceId,
      )
      const parsed = feedbackSchema.safeParse(payload)
      // Kiểm tra cả ở state, không chỉ ẩn form; BE phải thực thi lại các quy tắc này.
      if (
        !invoice ||
        invoice.status !== 'PAID' ||
        state.feedback[invoice.id] ||
        !parsed.success
      )
        return
      state.feedback[invoice.id] = { ...payload, ...parsed.data }
    },
  },
})

export const { submitFeedback, completePreviewPayment } = billingSlice.actions
export default billingSlice.reducer
