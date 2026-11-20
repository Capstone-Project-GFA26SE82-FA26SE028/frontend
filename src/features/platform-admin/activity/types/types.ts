export type ActivityLog = {
  auditLogId: string
  userId: string | null
  fullName: string | null
  userName: string | null
  email: string | null
  avatarUrl: string | null
  action: string | null
  entityName: string | null
  entityId: string | null
  oldValue: string | null
  newValue: string | null
  ipAddress: string | null
  createdAt: string
}
export type ActivityQuery = {
  page: number
  pageSize: number
  userId?: string
  search?: string
  action?: string
  from?: string
  to?: string
}

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
