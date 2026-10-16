import { TableAccessPage } from '../features/admin/table-qr/pages/TableAccessPage'
import { adminRoute } from './adminRoutes'
import { createBrowserRouter, Link, Navigate } from 'react-router-dom'
import { CustomerLayout } from '../layouts/customer/CustomerLayout'
import { EmptyState } from '../components/EmptyState/EmptyState'

export const router = createBrowserRouter([
  adminRoute,
  { path: '/table-access/:token', element: <TableAccessPage /> },
  // Temporary destination until the Customer table-session feature is migrated.
  {
    path: '/welcome',
    element: (
      <main className="flex min-h-dvh items-center justify-center bg-cream p-5">
        <section className="panel max-w-md p-8 text-center">
          <h1 className="text-xl font-semibold">Nhập số điện thoại</h1>
          <p className="mt-3 text-sm text-muted">
            Giao diện tham gia phiên bàn sẽ được chuyển ở bước Customer. Hiện
            tại bạn đang xem trước chức năng QR bàn.
          </p>
          <Link className="btn-primary mt-5" to="/admin/table-qr">
            Về mã QR bàn
          </Link>
        </section>
      </main>
    ),
  },
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
      { index: true, element: <Navigate to="/menu" replace /> },
      ...[
        { path: 'menu', title: 'Thực đơn' },
        { path: 'cart', title: 'Giỏ hàng' },
        { path: 'orders', title: 'Đơn của bạn' },
        { path: 'reservation', title: 'Đặt bàn' },
      ].map((page) => ({
        path: page.path,
        element: (
          <section className="panel my-6 p-6">
            <h1 className="text-2xl font-bold">{page.title}</h1>
            <p className="mt-2 text-sm text-muted">
              Nội dung chức năng sẽ được chuyển ở bước tiếp theo.
            </p>
          </section>
        ),
      })),
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
