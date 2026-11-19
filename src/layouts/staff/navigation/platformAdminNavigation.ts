import type { StaffNavigationGroup } from '../types/types'
export const platformAdminNavigation: StaffNavigationGroup[] = [
  {
    title: '',
    items: [{ to: '/platform-admin', label: 'Tổng quan', icon: 'home' }],
  },
  {
    title: 'QUẢN LÝ NHÀ HÀNG',
    items: [
      { to: '/platform-admin/restaurants', label: 'Nhà hàng', icon: 'store' },
    ],
  },
]
