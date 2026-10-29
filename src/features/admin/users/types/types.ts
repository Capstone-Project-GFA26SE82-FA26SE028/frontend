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
export type UserResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type UserDto = {
  userId: string
  userName: string
  email: string
  roleId: string
  fullName: string | null
  phoneNumber: string | null
  avatarUrl: string | null
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null
}
export type UserPage = {
  items: UserDto[]
  totalCount: number
  page: number
  pageSize: number
}
export function userRoleLabel(roleId: string) {
  const labels: Record<string, string> = {
    admin: 'Quản trị viên hệ thống',
    manager: 'Quản lý nhà hàng',
    waiter: 'Nhân viên phục vụ',
    cashier: 'Thu ngân',
    kitchen: 'Nhân viên bếp',
    inventory: 'Quản lý kho',
    supplier: 'Nhà cung cấp',
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
