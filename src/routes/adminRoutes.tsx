import { SessionsPage } from '../features/admin/sessions/pages/SessionsPage'
import { RolesPage } from '../features/admin/roles/pages/RolesPage'
import { UsersPage } from '../features/admin/users/pages/UsersPage'
import { Link, type RouteObject } from 'react-router-dom'
import { AdminLayout } from '../layouts/admin/AdminLayout'
import { adminNavigation } from '../layouts/admin/navigation'

// Replace each temporary element when its feature is migrated.
export const adminRoute: RouteObject = {
  path: '/admin',
  Component: AdminLayout,
  children: [
    { path: 'users', Component: UsersPage },
    { path: 'roles', Component: RolesPage },
    { path: 'sessions', Component: SessionsPage },
    ...adminNavigation
      .flatMap((group) => group.items)
      .filter((item) => !['users', 'roles', 'sessions'].includes(item.id))
      .map((item) => ({
        ...(item.id === 'overview'
          ? { index: true as const }
          : { path: item.id }),
        element: (
          <section className="rounded-2xl border border-slate-200/60 bg-white p-6">
            <h1 className="text-2xl font-bold text-slate-800">{item.label}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Nội dung chức năng sẽ được chuyển ở bước tiếp theo.
            </p>
          </section>
        ),
      })),
    {
      path: '*',
      element: (
        <div className="p-6">
          <h1 className="text-xl font-semibold">
            Không tìm thấy trang quản trị
          </h1>
          <Link to="/admin" className="mt-4 inline-block text-emerald-700">
            Về tổng quan
          </Link>
        </div>
      ),
    },
  ],
}
