export type TableSession = {
  tableSessionId: string
  tableId: string
  tableCode: string
  areaId: string
  restaurantId: string
  status: string
  openedAt: string
  isNewSession: boolean
}

export type GuestAccess = {
  tableSessionId: string
  expiresAt: string
}

export type ResolvedTableQr = { tableId: string }

export type TableSessionResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
