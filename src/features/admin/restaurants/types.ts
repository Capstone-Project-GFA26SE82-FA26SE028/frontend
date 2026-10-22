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
