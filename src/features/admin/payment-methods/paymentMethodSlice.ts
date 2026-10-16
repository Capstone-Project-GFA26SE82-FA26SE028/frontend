import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { paymentMethodsSchema, type PaymentMethods } from './schema'
import { mockPaymentMethods } from './data/mockPaymentMethods'
export const paymentMethodStorageKey = 'foodhub-admin-payment-methods-v1'
export const paymentMethodStateSchema = paymentMethodsSchema
function load(): PaymentMethods {
  try {
    const own = localStorage.getItem(paymentMethodStorageKey)
    // Read the previous snapshot only when this feature has no saved data yet.
    const value =
      own !== null
        ? JSON.parse(own)
        : JSON.parse(
            localStorage.getItem('foodhub-admin-restaurant-setup-v1') || 'null',
          )?.methods
    const result = paymentMethodStateSchema.safeParse(value)
    if (result.success) return result.data
  } catch {
    /* Keep preview usable if browser storage is unavailable. */
  }
  return mockPaymentMethods
}
const slice = createSlice({
  name: 'adminPaymentMethods',
  initialState: load(),
  reducers: {
    replacePaymentMethods: (_state, action: PayloadAction<PaymentMethods>) =>
      action.payload,
  },
})
export const { replacePaymentMethods } = slice.actions
export default slice.reducer
