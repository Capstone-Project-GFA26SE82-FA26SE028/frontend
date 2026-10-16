import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { profileSchema, type Profile } from './schema'
import { mockProfile } from './data/mockProfile'
export const profileStorageKey = 'foodhub-admin-restaurant-profile-v1'
export const profileStateSchema = profileSchema
function load(): Profile {
  try {
    const own = localStorage.getItem(profileStorageKey)
    // Read the previous snapshot only when this feature has no saved data yet.
    const value =
      own !== null
        ? JSON.parse(own)
        : JSON.parse(
            localStorage.getItem('foodhub-admin-restaurant-setup-v1') || 'null',
          )?.profile
    const result = profileStateSchema.safeParse(value)
    if (result.success) return result.data
  } catch {
    /* Keep preview usable if browser storage is unavailable. */
  }
  return mockProfile
}
const slice = createSlice({
  name: 'adminProfile',
  initialState: load(),
  reducers: {
    replaceProfile: (_state, action: PayloadAction<Profile>) => action.payload,
  },
})
export const { replaceProfile } = slice.actions
export default slice.reducer
