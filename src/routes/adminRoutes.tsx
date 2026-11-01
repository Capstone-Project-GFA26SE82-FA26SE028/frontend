import { DashboardPage } from '../features/admin/dashboard/pages/DashboardPage'
import { HealthPage } from '../features/admin/health/pages/HealthPage'
import { ActivityPage } from '../features/admin/activity/pages/ActivityPage'
import { PaymentMethodsPage } from '../features/admin/payment-methods/pages/PaymentMethodsPage'
import { TaxFeesPage } from '../features/admin/tax-fees/pages/TaxFeesPage'
import { TablesPage } from '../features/admin/tables/pages/TablesPage'
import { AreasPage } from '../features/admin/areas/pages/AreasPage'
import { RestaurantsPage } from '../features/admin/restaurants/pages/RestaurantsPage'
import { RestaurantStaffPage } from '../features/admin/restaurant-staff/pages/RestaurantStaffPage'
import { SessionsPage } from '../features/admin/sessions/pages/SessionsPage'
import { RolesPage } from '../features/admin/roles/pages/RolesPage'
import { UsersPage } from '../features/admin/users/pages/UsersPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { Link, type RouteObject } from 'react-router-dom'
import { StaffLayout } from '../layouts/staff/StaffLayout'

export const adminRoute: RouteObject = {
  path: '/admin',
  element: <StaffLayout role="admin" />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'roles', element: <RolesPage /> },
    { path: 'sessions', element: <SessionsPage /> },
    { path: 'restaurants', element: <RestaurantsPage /> },
    { path: 'restaurant-staff', element: <RestaurantStaffPage /> },
    { path: 'areas', element: <AreasPage /> },
    { path: 'tables', element: <TablesPage /> },
    { path: 'tax-fees', element: <TaxFeesPage /> },
    { path: 'payment-methods', element: <PaymentMethodsPage /> },
    { path: 'activity', element: <ActivityPage /> },
    { path: 'health', element: <HealthPage /> },
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
