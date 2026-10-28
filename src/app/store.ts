import kitchenReducer from '../features/kitchen/shared/kitchenSlice'
import authReducer from '../features/auth/authSlice'
import customerBillingReducer from '../features/customer/billing-feedback/billingSlice'
import customerSessionReducer from '../features/customer/table-session/sessionSlice'
import orderReducer from '../features/customer/payment/previewOrderSlice'
import adminPaymentMethodsReducer from '../features/admin/payment-methods/paymentMethodSlice'
import adminTaxFeesReducer from '../features/admin/tax-fees/taxFeeSlice'
import adminAreasReducer from '../features/admin/areas/areaSlice'
import adminTablesReducer from '../features/admin/tables/tableSlice'
import adminReducer, { adminStorageKey } from './adminReducer'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kitchen: kitchenReducer,
    customerBilling: customerBillingReducer,
    orders: orderReducer,
    customerSession: customerSessionReducer,
    admin: adminReducer,    adminAreas: adminAreasReducer,
    adminTables: adminTablesReducer,
    adminTaxFees: adminTaxFeesReducer,
    adminPaymentMethods: adminPaymentMethodsReducer,
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
