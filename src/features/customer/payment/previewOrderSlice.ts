import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PreviewOrder } from './previewOrderTypes'
import type { PaymentMethod } from './types'

const initialState: { orders: PreviewOrder[] } = { orders: [] }
const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    requestPayment: (state, { payload }: PayloadAction<PaymentMethod>) => {
      state.orders.forEach((order) => {
        order.paymentRequested = true
        order.method = payload
      })
    },
  },
})
export const { requestPayment } = slice.actions
export default slice.reducer
