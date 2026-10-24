import axios, { type InternalAxiosRequestConfig } from 'axios'
import { z } from 'zod'
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
import {
  authSessionSchema,
  authUserSchema,
  type AuthSession,
  type LoginInput,
} from '../types'

// Separate Axios instance prevents login/refresh from triggering a refresh loop.
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})
let revision = 0
let refreshTask: Promise<AuthSession> | null = null
let restoreTask: Promise<void> | null = null
function parseResult<T>(data: unknown, schema: z.ZodType<T>): T {
  const response = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!response.isSuccess) throw new Error('Unable to complete your request.')
  return schema.parse(response.result)
}
export function authErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Unable to connect to the server. Please try again.'
    if (error.response.status >= 500)
      return 'The sign-in service is temporarily unavailable. Please try again.'
    if (error.response.status === 401)
      return 'Incorrect sign-in details or your session has expired.'
    if (error.response.status === 403)
      return 'Access denied. Please contact your administrator.'
    if (error.response.status === 429)
      return 'Too many attempts. Please wait a moment and try again.'
    if (error.response.status === 404 || error.response.status === 405)
      return 'The sign-in API was not found. Please check the API connection configuration.'
    return 'Invalid request. Please check your details and try again.'
  }
  if (error instanceof z.ZodError)
    return 'The server returned an unexpected response.'
  return error instanceof Error ? error.message : 'Unable to sign in.'
}
function saveSession(session: AuthSession) {
  if (!session.user.isActive)
    throw new Error(
      'Your account is inactive. Please contact your administrator.',
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
  const { data } = await authClient.post('/auth/login', input)
  const session = parseResult(data, authSessionSchema)
  if (currentRevision !== revision)
    throw new Error(
      'This sign-in request is no longer valid. Please try again.',
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
      new Error('Your session has expired. Please sign in again.'),
    )
  }
  refreshTask = (async () => {
    try {
      const { data } = await authClient.post('/auth/refresh', {
        refreshToken: session.refreshToken,
      })
      const next = parseResult(data, authSessionSchema)
      if (revision !== currentRevision)
        throw new Error('Your session has changed. Please sign in again.')
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
      const { data } = await axiosClient.get('/users/me')
      if (revision !== currentRevision) return
      const user = parseResult(data, authUserSchema)
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
