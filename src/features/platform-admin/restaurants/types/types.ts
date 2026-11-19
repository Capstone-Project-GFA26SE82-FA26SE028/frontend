export type Restaurant = {
  restaurantId: string
  restaurantName: string
  address: string
  hotline: string
  taxCode: string | null
  logoUrl: string | null
  timeZone: string
  openingHours: { dayOfWeek: number; openAt: string; closeAt: string }[]
}
export type RestaurantQuery = {
  page: number
  pageSize: number
  search?: string
}

export type RestaurantResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type RestaurantPage = {
  items: Restaurant[]
  totalCount: number
  page: number
  pageSize: number
}
