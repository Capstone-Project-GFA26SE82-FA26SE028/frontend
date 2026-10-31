export type Table = {
  tableId: string
  areaId: string
  tableCode: string
  capacity: number
  positionX: number | null
  positionY: number | null
  version: string
  isActive: boolean
  cleaningStatus: string
}
export type TableMode =
  | 'qr'
  | 'view'
  | 'create'
  | 'edit'
  | 'move'
  | 'status'
  | 'delete'

export type TableQr = {
  qrId: string
  tableId: string
  tableCode: string
  areaId: string
  imageUrl: string | null
  createdAt: string
  revokedAt: string | null
  isUsable: boolean
}

export type TableResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type TablePage = {
  items: Table[]
  totalCount: number
  page: number
  pageSize: number
}
export type TableQrPage = {
  items: TableQr[]
  totalCount: number
}
export type TableQuery = {
  page: number
  pageSize: number
  search?: string
  restaurantId?: string
  areaId?: string
  isActive?: boolean
}
