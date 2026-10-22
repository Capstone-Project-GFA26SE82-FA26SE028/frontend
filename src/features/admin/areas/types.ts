export type Area = {
  areaId: string
  restaurantId: string
  areaCode: string
  areaName: string
  serviceType: string
  spaceType: string
  isActive: boolean
}
export type AreaQuery = {
  page: number
  pageSize: number
  search?: string
  restaurantId?: string
  isActive?: boolean
}
