import type { StaffNavigationGroup } from '../types/types'

export const adminNavigation: StaffNavigationGroup[] = [
  {
    title: '',
    items: [{ to: '/admin', label: 'Tổng quan', icon: 'home' }],
  },
  {
    title: 'QUẢN LÝ TÀI KHOẢN NHÂN VIÊN',
    items: [
      { to: '/admin/users', label: 'Tài khoản người dùng', icon: 'users' },
      { to: '/admin/roles', label: 'Vai trò và quyền hạn', icon: 'shield' },
    ],
  },
  {
    title: 'QUẢN LÝ NHÀ HÀNG',
    items: [
      { to: '/admin/areas', label: 'Khu vực nhà hàng', icon: 'grid' },
      { to: '/admin/tables', label: 'Bàn', icon: 'utensils' },
    ],
  },
  {
    title: 'CẤU HÌNH',
    items: [
      { to: '/admin/tax-fees', label: 'Thuế VAT và phí dịch vụ', icon: 'coin' },
      {
        to: '/admin/payment-methods',
        label: 'Phương thức thanh toán',
        icon: 'receipt',
      },
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      {
        to: '/admin/health',
        label: 'Giám sát hệ thống',
        icon: 'activity',
      },
    ],
  },
]
