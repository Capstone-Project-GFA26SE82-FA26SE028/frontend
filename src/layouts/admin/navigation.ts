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
      { id: 'roles', label: 'Vai trò & phân quyền', icon: 'shield' },
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
        id: 'restaurant-profile',
        label: 'Thông tin nhà hàng',
        icon: 'store',
      },
      { id: 'areas', label: 'Khu vực nhà hàng', icon: 'grid' },
      {
        id: 'tables',
        label: 'Danh sách bàn',
        icon: 'utensils',
      },
      { id: 'table-qr', label: 'Mã QR bàn', icon: 'grid' },
    ],
  },
  {
    title: 'CẤU HÌNH',
    items: [
      {
        id: 'tax-fees',
        label: 'VAT & phí dịch vụ',
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
