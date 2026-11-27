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

export type TableQrPage = {
  items: TableQr[]
  totalCount: number
}
