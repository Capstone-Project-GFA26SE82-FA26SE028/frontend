export type OnlineRestaurant = {
  restaurantId: string
  restaurantName: string
  address: string
  hotline: string
  logoUrl: string | null
}

export type RestaurantPage = {
  items: OnlineRestaurant[]
  totalCount: number
  page: number
  pageSize: number
}

export type RestaurantResponse = {
  isSuccess: boolean
  message?: string | null
  result: RestaurantPage
}
