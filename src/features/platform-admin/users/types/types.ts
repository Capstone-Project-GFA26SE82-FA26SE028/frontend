export type UserAccount = {
  restaurantId: string | null
  restaurantName: string | null
  provisioningPending: boolean
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
  restaurantId: string | null
  restaurantName: string | null
  provisioningPending: boolean
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
    admin: 'Quản trị nhà hàng',
    platform_admin: 'Quản trị nền tảng',
    customer: 'Khách hàng',
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

export type StaffTransfer = {
  id: string
  userId: string
  sourceRestaurantId: string
  targetRestaurantId: string
  status: 'Pending' | 'Completed' | 'Rejected'
  message: string | null
  createdAt: string
  completedAt: string | null
}

export function canTransferUser(user: UserAccount) {
  return (
    ['manager', 'waiter', 'cashier', 'kitchen', 'inventory'].includes(
      user.role,
    ) &&
    !!user.restaurantId &&
    !user.provisioningPending
  )
}
