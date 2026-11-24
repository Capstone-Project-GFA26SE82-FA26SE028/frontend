import { RolesPage } from '../features/platform-admin/roles/pages/RolesPage'
import { ActivityPage } from '../features/platform-admin/activity/pages/ActivityPage'
import { SessionsPage } from '../features/platform-admin/sessions/pages/SessionsPage'
import { RestaurantStaffPage } from '../features/platform-admin/restaurant-staff/pages/RestaurantStaffPage'
import type { RouteObject } from 'react-router-dom'
import { StaffLayout } from '../layouts/staff/StaffLayout'
import { PlatformAdminPage } from '../features/platform-admin/dashboard/pages/PlatformAdminPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RestaurantsPage } from '../features/platform-admin/restaurants/pages/RestaurantsPage'
import { UsersPage } from '../features/platform-admin/users/pages/UsersPage'
export const platformAdminRoute: RouteObject = {
  path: '/platform-admin',
  element: <StaffLayout role="platform_admin" />,
  children: [
    { index: true, element: <PlatformAdminPage /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'roles', element: <RolesPage /> },
    { path: 'activity', element: <ActivityPage /> },
    { path: 'sessions', element: <SessionsPage /> },
    { path: 'restaurants', element: <RestaurantsPage /> },
    { path: 'restaurant-staff', element: <RestaurantStaffPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
}
