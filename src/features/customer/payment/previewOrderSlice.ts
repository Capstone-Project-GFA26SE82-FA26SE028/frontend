import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PreviewOrder } from './previewOrderTypes'
const initialState: { orders: PreviewOrder[] } = { orders: [] }
const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    requestPayment: (state, { payload }: PayloadAction<'cash' | 'bank'>) => {
      state.orders.forEach((order) => {
        order.paymentRequested = true
        order.method = payload
      })
    },
  },
})
export const { requestPayment } = slice.actions
export default slice.reducer
