import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PreviewOrder } from './types'
const initialState: { orders: PreviewOrder[] } = { orders: [] }
const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, { payload }: PayloadAction<PreviewOrder>) => {
      state.orders.unshift(payload)
    },
    requestPayment: (state, { payload }: PayloadAction<'cash' | 'bank'>) => {
      state.orders.forEach((order) => {
        order.paymentRequested = true
        order.method = payload
      })
    },
  },
})
export const { placeOrder, requestPayment } = slice.actions
export default slice.reducer
