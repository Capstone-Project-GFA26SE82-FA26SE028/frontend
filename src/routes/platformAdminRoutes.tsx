import type { RouteObject } from 'react-router-dom'
import { StaffLayout } from '../layouts/staff/StaffLayout'
import { PlatformAdminPage } from '../features/platform-admin/pages/PlatformAdminPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RestaurantsPage } from '../features/platform-admin/restaurants/pages/RestaurantsPage'
export const platformAdminRoute: RouteObject = {
  path: '/platform-admin',
  element: <StaffLayout role="platform_admin" />,
  children: [
    { index: true, element: <PlatformAdminPage /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'restaurants', element: <RestaurantsPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
}
