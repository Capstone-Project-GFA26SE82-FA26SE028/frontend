import type { StaffNavigationGroup } from '../types/types'
export const platformAdminNavigation: StaffNavigationGroup[] = [
  {
    title: '',
    items: [{ to: '/platform-admin', label: 'Tổng quan', icon: 'home' }],
  },
  {
    title: 'QUẢN LÝ TÀI KHOẢN',
    items: [
      {
        to: '/platform-admin/users',
        label: 'Tài khoản người dùng',
        icon: 'users',
      },
      {
        to: '/platform-admin/roles',
        label: 'Vai trò và quyền hạn',
        icon: 'shield',
      },
      {
        to: '/platform-admin/sessions',
        label: 'Phiên đăng nhập',
        icon: 'monitor',
      },
    ],
  },
  {
    title: 'QUẢN LÝ NHÀ HÀNG',
    items: [
      { to: '/platform-admin/restaurants', label: 'Nhà hàng', icon: 'store' },
      {
        to: '/platform-admin/restaurant-staff',
        label: 'Phân công nhân viên',
        icon: 'briefcase',
      },
      {
        to: '/platform-admin/restaurant-registrations',
        label: 'Hồ sơ đăng ký',
        icon: 'clipboard',
      },
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      {
        to: '/platform-admin/activity',
        label: 'Nhật ký hoạt động',
        icon: 'clipboard',
      },
    ],
  },
]
