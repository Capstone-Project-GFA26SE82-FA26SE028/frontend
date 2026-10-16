import { DashboardPage } from '../features/admin/dashboard/pages/DashboardPage'
import { HealthPage } from '../features/admin/health/pages/HealthPage'
import { ActivityPage } from '../features/admin/activity/pages/ActivityPage'
import { PaymentMethodsPage } from '../features/admin/payment-methods/pages/PaymentMethodsPage'
import { TaxFeesPage } from '../features/admin/tax-fees/pages/TaxFeesPage'
import { TableQrPage } from '../features/admin/table-qr/pages/TableQrPage'
import { TablesPage } from '../features/admin/tables/pages/TablesPage'
import { AreasPage } from '../features/admin/areas/pages/AreasPage'
import { RestaurantProfilePage } from '../features/admin/restaurant-profile/pages/RestaurantProfilePage'
import { SessionsPage } from '../features/admin/sessions/pages/SessionsPage'
import { RolesPage } from '../features/admin/roles/pages/RolesPage'
import { UsersPage } from '../features/admin/users/pages/UsersPage'
import { Link, type RouteObject } from 'react-router-dom'
import { AdminLayout } from '../layouts/admin/AdminLayout'

export const adminRoute: RouteObject = {
  path: '/admin',
  Component: AdminLayout,
  children: [
    { index: true, Component: DashboardPage },
    { path: 'users', Component: UsersPage },
    { path: 'roles', Component: RolesPage },
    { path: 'sessions', Component: SessionsPage },
    { path: 'restaurant-profile', Component: RestaurantProfilePage },
    { path: 'areas', Component: AreasPage },
    { path: 'tables', Component: TablesPage },
    { path: 'table-qr', Component: TableQrPage },
    { path: 'tax-fees', Component: TaxFeesPage },
    { path: 'payment-methods', Component: PaymentMethodsPage },
    { path: 'activity', Component: ActivityPage },
    { path: 'health', Component: HealthPage },
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
