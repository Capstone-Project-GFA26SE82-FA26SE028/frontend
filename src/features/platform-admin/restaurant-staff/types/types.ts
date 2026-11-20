export type RestaurantStaff = {
  restaurantId: string
  userIdRef: string
  isActive: boolean
  fullName: string | null
  userName: string | null
  email: string | null
  roleId: string | null
  avatarUrl: string | null
}

export type RestaurantStaffResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}

export type StaffAccount = {
  userId: string
  userName: string
  fullName: string | null
  email: string
  roleId: string
  restaurantId: string | null
  restaurantName: string | null
}
export type StaffAccountPage = {
  items: StaffAccount[]
  totalCount: number
  page: number
  pageSize: number
}
