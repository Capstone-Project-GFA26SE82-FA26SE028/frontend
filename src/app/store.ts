import authReducer from '../features/auth/authSlice'
import customerBillingReducer from '../features/customer/billing-feedback/billingSlice'
import customerSessionReducer from '../features/customer/table-session/sessionSlice'
import orderReducer from '../features/customer/payment/previewOrderSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerBilling: customerBillingReducer,
    orders: orderReducer,
    customerSession: customerSessionReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
