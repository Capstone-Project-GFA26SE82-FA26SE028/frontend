import { createSlice } from '@reduxjs/toolkit'
import type { CartState } from './types'

const initialState: CartState = { items: [] }

// Extend actions when implementing menu selection and cart editing.
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
    },
  },
})
export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
