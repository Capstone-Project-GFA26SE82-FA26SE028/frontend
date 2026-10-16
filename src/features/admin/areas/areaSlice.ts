import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { areaSchema, type Area } from './schema'
import { mockAreas } from './data/mockAreas'
export const areaStorageKey = 'foodhub-admin-areas-v1'
export const areaStateSchema = areaSchema.array()
function load(): Area[] {
  try {
    const own = localStorage.getItem(areaStorageKey)
    // Read the previous snapshot only when this feature has no saved data yet.
    const value =
      own !== null
        ? JSON.parse(own)
        : JSON.parse(
            localStorage.getItem('foodhub-admin-restaurant-setup-v1') || 'null',
          )?.areas
    const result = areaStateSchema.safeParse(value)
    if (result.success) return result.data
  } catch {
    /* Keep preview usable if browser storage is unavailable. */
  }
  return mockAreas
}
const slice = createSlice({
  name: 'adminAreas',
  initialState: load(),
  reducers: {
    replaceAreas: (_state, action: PayloadAction<Area[]>) => action.payload,
  },
})
export const { replaceAreas } = slice.actions
export default slice.reducer
