import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, CartState } from './types'
const initialState: CartState = { items: [] }
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<CartItem>) => {
      if (
        payload.tableSessionId &&
        state.items.some((i) => i.tableSessionId !== payload.tableSessionId)
      )
        state.items = []
      const item = state.items.find(
        (i) =>
          i.dishId === payload.dishId &&
          i.note === payload.note &&
          i.option === payload.option &&
          i.unitPrice === payload.unitPrice &&
          i.tableSessionId === payload.tableSessionId &&
          JSON.stringify(i.optionSelections) ===
            JSON.stringify(payload.optionSelections),
      )
      if (item) item.quantity += payload.quantity
      else state.items.push(payload)
    },
    setQuantity: (
      state,
      { payload }: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      if (payload.quantity <= 0)
        state.items = state.items.filter((i) => i.id !== payload.id)
      else {
        const item = state.items.find((i) => i.id === payload.id)
        if (item) item.quantity = Math.min(99, payload.quantity)
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})
export const { addItem, setQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
