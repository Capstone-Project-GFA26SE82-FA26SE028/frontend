export type RestaurantStaff = {
  restaurantId: string
  userIdRef: string
  isActive: boolean
}

export type RestaurantStaffResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
