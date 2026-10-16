export const roles = [
  'Admin',
  'Manager',
  'Waiter',
  'Cashier',
  'Kitchen',
  'Inventory',
  'Supplier',
] as const
export type Role = (typeof roles)[number]
export const roleLabels: Record<Role, string> = {
  Admin: 'Quản trị nền tảng',
  Manager: 'Quản lý nhà hàng',
  Waiter: 'Phục vụ',
  Cashier: 'Thu ngân',
  Kitchen: 'Nhân viên bếp',
  Inventory: 'Quản lý kho',
  Supplier: 'Nhà cung cấp',
}
export type AdminRestaurant = {
  id: string
  name: string
  active: boolean
}
export type AdminUser = {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  restaurantId: string
  active: boolean
  created: string
}
export type UsersState = {
  restaurants: AdminRestaurant[]
  users: AdminUser[]
}
