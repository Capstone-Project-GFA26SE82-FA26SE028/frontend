type AdminNavigationItem = {
  id: string
  label: string
  icon: string
}
export const adminNavigation: {
  title: string
  items: AdminNavigationItem[]
}[] = [
  { title: '', items: [{ id: 'overview', label: 'Tổng quan', icon: 'home' }] },
  {
    title: 'QUẢN LÝ TÀI KHOẢN',
    items: [
      { id: 'users', label: 'Tài khoản người dùng', icon: 'users' },
      { id: 'roles', label: 'Vai trò và quyền hạn', icon: 'shield' },
      {
        id: 'sessions',
        label: 'Phiên đăng nhập',
        icon: 'monitor',
      },
    ],
  },
  {
    title: 'QUẢN LÝ NHÀ HÀNG',
    items: [
      {
        id: 'restaurants',
        label: 'Nhà hàng',
        icon: 'store',
      },
      { id: 'restaurant-staff', label: 'Phân công nhân viên', icon: 'briefcase' },
      { id: 'areas', label: 'Khu vực nhà hàng', icon: 'grid' },
      {
        id: 'tables',
        label: 'Bàn',
        icon: 'utensils',
      },
    ],
  },
  {
    title: 'CẤU HÌNH',
    items: [
      {
        id: 'tax-fees',
        label: 'Thuế VAT và phí dịch vụ',
        icon: 'coin',
      },
      {
        id: 'payment-methods',
        label: 'Phương thức thanh toán',
        icon: 'receipt',
      },
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      { id: 'activity', label: 'Nhật ký hoạt động', icon: 'clipboard' },
      { id: 'health', label: 'Giám sát hệ thống', icon: 'activity' },
    ],
  },
]

export function adminHref(id: string) {
  return id === 'overview' ? '/admin' : `/admin/${id}`
}
