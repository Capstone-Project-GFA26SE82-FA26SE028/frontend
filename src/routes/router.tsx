import { ReservationPage } from '../features/customer/reservation/pages/ReservationPage'
import { PaymentPage } from '../features/customer/payment/pages/PaymentPage'
import { OrderTrackingPage } from '../features/customer/order-tracking/pages/OrderTrackingPage'
import { CheckoutPage } from '../features/customer/checkout/pages/CheckoutPage'
import { CartPage } from '../features/customer/cart/pages/CartPage'
import { MenuPage } from '../features/customer/menu/pages/MenuPage'
import { PhoneEntryPage } from '../features/customer/table-session/pages/PhoneEntryPage'
import { CustomerSessionGate } from '../features/customer/table-session/components/CustomerSessionGate'
import { TableAccessPage } from '../features/admin/table-qr/pages/TableAccessPage'
import { adminRoute } from './adminRoutes'
import { createBrowserRouter, Link } from 'react-router-dom'
import { CustomerLayout } from '../layouts/customer/CustomerLayout'
import { EmptyState } from '../components/EmptyState/EmptyState'

export const router = createBrowserRouter([
  adminRoute,
  { path: '/table-access/:token', element: <TableAccessPage /> },
  { path: '/', element: <PhoneEntryPage /> },
  { path: '/welcome', element: <PhoneEntryPage /> },
  {
    element: <CustomerLayout />,
    errorElement: (
      <EmptyState
        title="Không thể mở trang"
        description="Vui lòng tải lại trang để thử lại."
        action={<a href="/">Về trang chủ</a>}
      />
    ),
    children: [
      {
        element: <CustomerSessionGate />,
        children: [
          { path: 'menu', element: <MenuPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <OrderTrackingPage /> },
          { path: 'payment', element: <PaymentPage /> },
        ],
      },
      { path: 'reservation', element: <ReservationPage /> },
      {
        path: '*',
        element: (
          <EmptyState
            title="Không tìm thấy trang"
            description="Đường dẫn này không tồn tại."
            action={<Link to="/">Về thực đơn</Link>}
          />
        ),
      },
    ],
  },
])
