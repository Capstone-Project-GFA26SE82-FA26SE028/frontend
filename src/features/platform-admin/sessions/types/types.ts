export type SessionStatus = 'active' | 'expired' | 'revoked'
export type LoginSession = {
  userSessionId: string
  userId: string
  userName: string
  email: string
  roleId: string
  ipAddress: string | null
  userAgent: string | null
  deviceType: string | null
  loggedInAt: string
  expiresAt: string
  revokedAt: string | null
  isCurrent: boolean
}
export type SessionRole = { roleId: string; roleName: string }
export type SessionQuery = {
  page: number
  pageSize: number
  userId?: string
  search?: string
  roleId?: string
  status?: SessionStatus
  deviceType?: string
  fromUtc?: string
  toUtc?: string
}
export type SessionCounts = {
  all: number
  active: number
  expired: number
  revoked: number
}
export function sessionStatus(session: LoginSession): SessionStatus {
  if (session.revokedAt) return 'revoked'
  return Date.parse(session.expiresAt) <= Date.now() ? 'expired' : 'active'
}

export type SessionResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type SessionPage = {
  items: LoginSession[]
  totalCount: number
  page: number
  pageSize: number
}
