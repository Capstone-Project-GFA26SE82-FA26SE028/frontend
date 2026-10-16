import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'
import { feeSchema, type FeeVersion } from './schema'
import { mockTaxFees } from './data/mockTaxFees'
export const taxFeeStorageKey = 'foodhub-admin-tax-fees-v1'
export const taxFeeStateSchema = feeSchema.extend({ id: z.string() }).array()
function load(): FeeVersion[] {
  try {
    const own = localStorage.getItem(taxFeeStorageKey)
    // Read the previous snapshot only when this feature has no saved data yet.
    const value =
      own !== null
        ? JSON.parse(own)
        : JSON.parse(
            localStorage.getItem('foodhub-admin-restaurant-setup-v1') || 'null',
          )?.fees
    const result = taxFeeStateSchema.safeParse(value)
    if (result.success) return result.data
  } catch {
    /* Keep preview usable if browser storage is unavailable. */
  }
  return mockTaxFees
}
const slice = createSlice({
  name: 'adminTaxFees',
  initialState: load(),
  reducers: {
    replaceTaxFees: (_state, action: PayloadAction<FeeVersion[]>) =>
      action.payload,
  },
})
export const { replaceTaxFees } = slice.actions
export default slice.reducer
