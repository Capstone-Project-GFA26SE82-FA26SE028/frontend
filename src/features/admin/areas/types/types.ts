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

export type AreaResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type AreaPage = {
  items: Area[]
  totalCount: number
  page: number
  pageSize: number
}
