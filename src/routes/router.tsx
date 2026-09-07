import { createBrowserRouter, Link, Navigate } from 'react-router-dom'
import { CustomerLayout } from '../layouts/CustomerLayout'
import { MenuPage } from '../features/customer/menu/pages/MenuPage'
import { CartPage } from '../features/customer/cart/pages/CartPage'
import { EmptyState } from '../components/EmptyState/EmptyState'

export const router = createBrowserRouter([
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
      { index: true, element: <Navigate to="/" replace /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'cart', element: <CartPage /> },
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
