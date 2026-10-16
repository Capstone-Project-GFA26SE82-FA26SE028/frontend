import adminAreasReducer from '../features/admin/areas/areaSlice'
import adminTablesReducer from '../features/admin/tables/tableSlice'
import adminProfileReducer from '../features/admin/restaurant-profile/profileSlice'
import adminReducer, { adminStorageKey } from './adminReducer'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/customer/cart/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    admin: adminReducer,
    adminProfile: adminProfileReducer,
    adminAreas: adminAreasReducer,
    adminTables: adminTablesReducer,
  },
})
let previousAdminState = store.getState().admin
store.subscribe(() => {
  const current = store.getState().admin
  if (current === previousAdminState) return
  previousAdminState = current
  try {
    localStorage.setItem(adminStorageKey, JSON.stringify(current))
  } catch {
    /* State remains usable for this session. */
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
