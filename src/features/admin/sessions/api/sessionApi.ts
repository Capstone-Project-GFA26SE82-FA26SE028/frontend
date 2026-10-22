import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { LoginSession, SessionQuery, SessionRole } from '../types'

const sessionSchema: z.ZodType<LoginSession> = z.object({
  userSessionId: z.string(),
  userId: z.string(),
  userName: z.string(),
  email: z.string(),
  roleId: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  deviceType: z.string().nullable(),
  loggedInAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }),
  revokedAt: z.string().datetime({ offset: true }).nullable(),
  isCurrent: z.boolean(),
})
const pageSchema = z.object({
  items: z.array(sessionSchema),
  totalCount: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})
function result<T>(data: unknown, schema: z.ZodType<T>): T {
  const envelope = z
    .object({ isSuccess: z.boolean(), result: z.unknown() })
    .parse(data)
  if (!envelope.isSuccess) throw new Error('Unable to complete the request.')
  return schema.parse(envelope.result)
}
export async function getSessions(params: SessionQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get('/sessions', { params, signal })
  return result(data, pageSchema)
}
export async function getSessionRoles(
  signal?: AbortSignal,
): Promise<SessionRole[]> {
  const { data } = await axiosClient.get('/roles', { signal })
  return result(
    data,
    z.array(z.object({ roleId: z.string(), roleName: z.string() })),
  )
}
export async function revokeSession(id: string | 'all') {
  const path =
    id === 'all' ? '/sessions/me' : '/sessions/me/' + encodeURIComponent(id)
  const { data } = await axiosClient.delete(path)
  const response = z.object({ isSuccess: z.boolean() }).parse(data)
  if (!response.isSuccess)
    throw new Error('Unable to revoke the session. Please try again.')
}
export function sessionApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Unable to connect to the server. Please try again.'
    if (status >= 500)
      return 'The session service is temporarily unavailable. Please try again.'
    if (status === 401) return 'Your session has expired. Please sign in again.'
    if (status === 403)
      return 'You do not have permission to access these sessions.'
    if (status === 404)
      return 'This session no longer exists or does not belong to your account.'
    if (status === 429) return 'Too many requests. Please wait and try again.'
    return 'Invalid request. Please check the filters and try again.'
  }
  if (error instanceof z.ZodError)
    return 'The server returned an unexpected response.'
  return error instanceof Error
    ? error.message
    : 'Unable to complete the request.'
}
