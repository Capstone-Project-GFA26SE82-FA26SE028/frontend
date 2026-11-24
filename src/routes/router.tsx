import { kitchenRoute } from './kitchenRoutes'
import { cashierRoute } from './cashierRoutes'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { CustomerProfilePage } from '../features/profile/pages/CustomerProfilePage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { BillingFeedbackPage } from '../features/customer/billing-feedback/pages/BillingFeedbackPage'
import { ReservationPage } from '../features/customer/reservation/pages/ReservationPage'
import { PaymentPage } from '../features/customer/payment/pages/PaymentPage'
import { OrderTrackingPage } from '../features/customer/order-tracking/pages/OrderTrackingPage'
import { CheckoutPage } from '../features/customer/checkout/pages/CheckoutPage'
import { CartPage } from '../features/customer/cart/pages/CartPage'
import { MenuPage } from '../features/customer/menu/pages/MenuPage'
import { LoyaltyPage } from '../features/customer/loyalty/pages/LoyaltyPage'
import { CustomerSessionGate } from '../features/customer/table-session/components/CustomerSessionGate'
import { platformAdminRoute } from './platformAdminRoutes'
import { adminRoute } from './adminRoutes'
import { managerRoute } from './managerRoutes'
import { useAppSelector } from '../app/hooks'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { RestaurantsPage } from '../features/customer/restaurants/pages/RestaurantsPage'
import { TakeawayMenuPage } from '../features/customer/takeaway-menu/pages/TakeawayMenuPage'
import { TakeawayCartPage } from '../features/customer/takeaway-cart/pages/TakeawayCartPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { CustomerLayout } from '../layouts/customer/CustomerLayout'
import { EmptyState } from '../components/EmptyState/EmptyState'

// Customer pages allow guests and customers; staff return to their workspace.
// This guard stays with the route configuration.
// eslint-disable-next-line react-refresh/only-export-components
function CustomerPageRoute() {
  const role = useAppSelector((state) => state.auth.session?.user.roleId)
  if (!role || role === 'customer') return <Outlet />
  if (role === 'admin') return <Navigate to="/admin" replace />
  if (role === 'platform_admin')
    return <Navigate to="/platform-admin" replace />
  if (role === 'manager') return <Navigate to="/manager" replace />
  if (role === 'kitchen') return <Navigate to="/kitchen" replace />
  if (role === 'cashier') return <Navigate to="/cashier" replace />
  return <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute roles={['customer']} />,
        children: [
          { path: '/profile', element: <CustomerProfilePage /> },
          {
            path: '/restaurants/:restaurantId/menu',
            element: <TakeawayMenuPage />,
          },
          {
            path: '/restaurants/:restaurantId/cart',
            element: <TakeawayCartPage />,
          },
        ],
      },
      { element: <RoleRoute roles={['kitchen']} />, children: [kitchenRoute] },
      { element: <RoleRoute roles={['cashier']} />, children: [cashierRoute] },
      { element: <RoleRoute roles={['admin']} />, children: [adminRoute] },
      {
        element: <RoleRoute roles={['platform_admin']} />,
        children: [platformAdminRoute],
      },
      { element: <RoleRoute roles={['manager']} />, children: [managerRoute] },
    ],
  },
  {
    element: <CustomerPageRoute />,
    children: [
      { path: '/register', element: <RegisterPage /> },
      { path: '/', element: <HomePage /> },
      { path: '/restaurants', element: <RestaurantsPage /> },
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
              { path: 'loyalty', element: <LoyaltyPage /> },
              { path: 'payment', element: <PaymentPage /> },
              { path: 'bill', element: <BillingFeedbackPage /> },
              { path: 'bill/:invoiceId', element: <BillingFeedbackPage /> },
            ],
          },
        ],
      },
      { path: '/reservation', element: <ReservationPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
