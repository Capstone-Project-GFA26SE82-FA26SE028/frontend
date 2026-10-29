import { kitchenRoute } from './kitchenRoutes'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { BillingFeedbackPage } from '../features/customer/billing-feedback/pages/BillingFeedbackPage'
import { ReservationPage } from '../features/customer/reservation/pages/ReservationPage'
import { PaymentPage } from '../features/customer/payment/pages/PaymentPage'
import { OrderTrackingPage } from '../features/customer/order-tracking/pages/OrderTrackingPage'
import { CheckoutPage } from '../features/customer/checkout/pages/CheckoutPage'
import { CartPage } from '../features/customer/cart/pages/CartPage'
import { MenuPage } from '../features/customer/menu/pages/MenuPage'
import { CustomerSessionGate } from '../features/customer/table-session/components/CustomerSessionGate'
import { adminRoute } from './adminRoutes'
import { managerRoute } from './managerRoutes'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { CustomerLayout } from '../layouts/customer/CustomerLayout'
import { EmptyState } from '../components/EmptyState/EmptyState'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { element: <RoleRoute roles={['kitchen']} />, children: [kitchenRoute] },
      { element: <RoleRoute roles={['admin']} />, children: [adminRoute] },
      { element: <RoleRoute roles={['manager']} />, children: [managerRoute] },
    ],
  },
  { path: '/', element: <HomePage /> },
  {
    element: <CustomerSessionGate />,
    errorElement: (
      <EmptyState
        title="Không thể mở trang"
        description="Vui lòng tải lại trang để thử lại."
        action={<a href="/">Về trang chủ</a>}
      />
    ),
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: 'menu', element: <MenuPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <OrderTrackingPage /> },
          { path: 'payment', element: <PaymentPage /> },
          { path: 'bill', element: <BillingFeedbackPage /> },
          { path: 'bill/:invoiceId', element: <BillingFeedbackPage /> },
        ],
      },
    ],
  },
  { path: '/reservation', element: <ReservationPage /> },
  { path: '*', element: <NotFoundPage /> },
])
