import axios, { type InternalAxiosRequestConfig } from 'axios'
import { axiosClient } from '../../../api/axiosClient'
import { store } from '../../../app/store'
import { queryClient } from '../../../app/queryClient'
import {
  authStorageKey,
  sessionReceived,
  signedOut,
  sessionChecking,
  sessionCheckFailed,
} from '../authSlice'
import type { AuthResponse, AuthSession, AuthUser, LoginInput } from '../types/types'

// Separate Axios instance prevents login/refresh from triggering a refresh loop.
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})
let revision = 0
let refreshTask: Promise<AuthSession> | null = null
let restoreTask: Promise<void> | null = null
function parseResult<T>(response: AuthResponse<T>): T {
  if (!response.isSuccess)
    throw new Error('Không thể hoàn tất yêu cầu. Vui lòng thử lại.')
  return response.result
}
export function authErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (error.response.status >= 500)
      return 'Dịch vụ đăng nhập đang gián đoạn. Vui lòng thử lại.'
    if (error.response.status === 401)
      return 'Thông tin đăng nhập không đúng hoặc phiên đăng nhập đã hết hạn.'
    if (error.response.status === 403)
      return 'Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.'
    if (error.response.status === 429)
      return 'Bạn đã thử quá nhiều lần. Vui lòng đợi một lát rồi thử lại.'
    if (error.response.status === 404 || error.response.status === 405)
      return 'Không tìm thấy API đăng nhập. Vui lòng kiểm tra cấu hình kết nối API.'
    return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin và thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể đăng nhập.'
}
function saveSession(session: AuthSession) {
  if (!session.user.isActive)
    throw new Error(
      'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.',
    )
  try {
    sessionStorage.setItem(authStorageKey, JSON.stringify(session))
  } catch {
    /* Storage may be disabled. */
  }
  store.dispatch(sessionReceived(session))
}
export function clearSession() {
  revision += 1
  try {
    sessionStorage.removeItem(authStorageKey)
  } catch {
    /* Storage may be disabled. */
  }
  store.dispatch(signedOut())
  queryClient.clear()
}
export async function login(input: LoginInput) {
  clearSession()
  const currentRevision = revision
  const { data } = await authClient.post<AuthResponse<AuthSession>>('/auth/login', input)
  const session = parseResult(data)
  if (currentRevision !== revision)
    throw new Error(
      'Yêu cầu đăng nhập này không còn hiệu lực. Vui lòng thử lại.',
    )
  saveSession(session)
  return session
}
export function refreshSession(): Promise<AuthSession> {
  if (refreshTask) return refreshTask
  const session = store.getState().auth.session
  const currentRevision = revision
  if (!session || Date.parse(session.sessionExpiresAt) <= Date.now()) {
    clearSession()
    return Promise.reject(
      new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'),
    )
  }
  refreshTask = (async () => {
    try {
      const { data } = await authClient.post<AuthResponse<AuthSession>>('/auth/refresh', {
        refreshToken: session.refreshToken,
      })
      const next = parseResult(data)
      if (revision !== currentRevision)
        throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại.')
      saveSession(next)
      return next
    } catch (error) {
      if (
        revision === currentRevision &&
        axios.isAxiosError(error) &&
        [400, 401, 403].includes(error.response?.status ?? 0)
      )
        clearSession()
      throw error
    } finally {
      refreshTask = null
    }
  })()
  return refreshTask
}
type AuthRequest = InternalAxiosRequestConfig & {
  retried?: boolean
  authRevision?: number
  sentToken?: string
}
axiosClient.interceptors.request.use((config: AuthRequest) => {
  const session = store.getState().auth.session
  config.authRevision = revision
  config.sentToken = session?.accessToken
  if (session)
    config.headers.set('Authorization', 'Bearer ' + session.accessToken)
  else config.headers.delete('Authorization')
  return config
})
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error
    const config = error.config as AuthRequest | undefined
    if (
      error.response?.status !== 401 ||
      !config?.sentToken ||
      config.authRevision !== revision
    )
      throw error
    if (config.retried) {
      clearSession()
      throw error
    }
    config.retried = true
    const session = store.getState().auth.session
    if (!session) throw error
    if (session.accessToken === config.sentToken) await refreshSession()
    if (config.authRevision !== revision) throw error
    return axiosClient(config)
  },
)
export function restoreSession(): Promise<void> {
  if (restoreTask) return restoreTask
  if (!store.getState().auth.session) return Promise.resolve()
  const currentRevision = revision
  store.dispatch(sessionChecking())
  restoreTask = (async () => {
    try {
      const { data } = await axiosClient.get<AuthResponse<AuthUser>>('/users/me')
      if (revision !== currentRevision) return
      const user = parseResult(data)
      const session = store.getState().auth.session
      if (!user.isActive) {
        clearSession()
        return
      }
      if (session) saveSession({ ...session, user })
    } catch (error) {
      if (revision === currentRevision)
        store.dispatch(sessionCheckFailed(authErrorMessage(error)))
    } finally {
      restoreTask = null
    }
  })()
  return restoreTask
}
export async function logout() {
  const currentRevision = revision
  try {
    await axiosClient.post('/auth/logout')
  } finally {
    if (revision === currentRevision) clearSession()
  }
}
