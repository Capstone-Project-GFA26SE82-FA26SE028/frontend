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

// API-backed accounts. Legacy AdminUser remains for screens not yet migrated.
export type UserAccount = {
  id: string
  userName: string
  name: string
  email: string
  phone: string
  role: string
  active: boolean
  created: string | null
  updated: string | null
  avatarUrl: string | null
}
export type UserRole = { roleId: string; roleName: string }
export function userRoleLabel(roleId: string) {
  const labels: Record<string, string> = {
    admin: 'System administrator',
    manager: 'Restaurant manager',
    waiter: 'Waiter',
    cashier: 'Cashier',
    kitchen: 'Kitchen staff',
    inventory: 'Inventory manager',
    supplier: 'Supplier',
  }
  return labels[roleId] || roleId
}
export type UserQuery = {
  page: number
  pageSize: number
  search?: string
  roleId?: string
  isActive?: boolean
}
