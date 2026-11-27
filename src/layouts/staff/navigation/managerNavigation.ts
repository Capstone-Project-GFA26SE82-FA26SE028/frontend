import type { StaffNavigationGroup } from '../types/types'

export const managerNavigation: StaffNavigationGroup[] = [
  { title: '', items: [{ to: '/manager', label: 'Tổng quan', icon: 'home' }] },
  {
    title: 'ƯU ĐÃI',
    items: [
      { to: '/manager/promotions', label: 'Khuyến mãi', icon: 'coin' },
      { to: '/manager/vouchers', label: 'Voucher', icon: 'ticket' },
    ],
  },
  {
    title: 'QUẢN LÝ TRẠM BẾP',
    items: [
      {
        to: '/manager/kitchen-stations',
        label: 'Danh sách trạm bếp',
        icon: 'fire',
        end: true,
      },
      {
        to: '/manager/kitchen-stations/items',
        label: 'Thiết lập món cho trạm',
        icon: 'utensils',
      },
      {
        to: '/manager/kitchen-stations/assignments',
        label: 'Phân công nhân viên bếp',
        icon: 'users',
      },
    ],
  },
  {
    title: 'THỰC ĐƠN VÀ GIÁ BÁN',
    items: [
      { to: '/manager/menu/categories', label: 'Danh mục', icon: 'grid' },
      { to: '/manager/menu/items', label: 'Món ăn', icon: 'utensils' },
      { to: '/manager/menu/options', label: 'Tùy chọn món', icon: 'settings' },
      { to: '/manager/menu/prices', label: 'Giá bán', icon: 'coin' },
    ],
  },
  {
    title: 'NGUYÊN LIỆU VÀ GIÁ VỐN',
    items: [
      { to: '/manager/ingredients', label: 'Nguyên liệu', icon: 'leaf' },
      { to: '/manager/units', label: 'Đơn vị và quy đổi', icon: 'settings' },
      {
        to: '/manager/recipes',
        label: 'Công thức và định mức',
        icon: 'clipboard',
      },
      { to: '/manager/food-cost', label: 'Giá vốn món ăn', icon: 'chart' },
    ],
  },
  {
    title: 'THEO DÕI KHO',
    items: [
      { to: '/manager/stock', label: 'Tổng quan tồn kho', icon: 'box' },
      {
        to: '/manager/stock-history',
        label: 'Biến động và lô hàng',
        icon: 'clipboard',
      },
      {
        to: '/manager/stock-variance',
        label: 'Tiêu hao và chênh lệch',
        icon: 'activity',
      },
    ],
  },
  {
    title: 'THEO DÕI VẬN HÀNH',
    items: [
      { to: '/manager/reports', label: 'Báo cáo nhà hàng', icon: 'chart' },
      { to: '/manager/orders', label: 'Quản lí đơn hàng', icon: 'clipboard' },
      { to: '/manager/payments', label: 'Quản lý thanh toán', icon: 'coin' },
      {
        to: '/manager/table-monitoring',
        label: 'Bàn & QR',
        icon: 'utensils',
      },
      { to: '/manager/kitchen-monitoring', label: 'Tiến độ bếp', icon: 'fire' },
      {
        to: '/manager/staff-activity',
        label: 'Hoạt động nhân viên',
        icon: 'users',
      },
    ],
  },
]
