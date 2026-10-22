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

export type ActivityUser = {
  userId: string
  userName: string
  fullName: string | null
  avatarUrl: string | null
  email: string
}
