import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { tableSchema, type RestaurantTable } from './schema'
import { mockTables } from './data/mockTables'
export const tableStorageKey = 'foodhub-admin-tables-v1'
export const tableStateSchema = tableSchema.array()
function load(): RestaurantTable[] {
  try {
    const own = localStorage.getItem(tableStorageKey)
    // Read the previous snapshot only when this feature has no saved data yet.
    const value =
      own !== null
        ? JSON.parse(own)
        : JSON.parse(
            localStorage.getItem('foodhub-admin-restaurant-setup-v1') || 'null',
          )?.tables
    const result = tableStateSchema.safeParse(value)
    if (result.success) return result.data
  } catch {
    /* Keep preview usable if browser storage is unavailable. */
  }
  return mockTables
}
const slice = createSlice({
  name: 'adminTables',
  initialState: load(),
  reducers: {
    replaceTables: (_state, action: PayloadAction<RestaurantTable[]>) =>
      action.payload,
  },
})
export const { replaceTables } = slice.actions
export default slice.reducer
