export type ActivityLog = {
  auditLogId: string
  userId: string | null
  action: string | null
  entityName: string | null
  entityId: string | null
  oldValue: string | null
  newValue: string | null
  ipAddress: string | null
  createdAt: string
}
export type ActivityQuery = { page: number; pageSize: number; userId?: string }

export type ActivityResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type ActivityPage = {
  items: ActivityLog[]
  totalCount: number
  page: number
  pageSize: number
}
