export type AuthUser = {
  userId: string
  roleId: string
  userName: string
  email: string
  fullName?: string | null
  isActive: boolean
}
export type AuthSession = {
  user: AuthUser
  accessToken: string
  refreshToken: string
  sessionId: string
  expiresAt: string
  sessionExpiresAt: string
}
export type AuthResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
export type LoginInput = { email: string; password: string }
