import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { ActivityLog, ActivityQuery } from '../types'
const logSchema: z.ZodType<ActivityLog> = z.object({
  auditLogId: z.string(),
  userId: z.string().nullable(),
  action: z.string().nullable(),
  entityName: z.string().nullable(),
  entityId: z.string().nullable(),
  oldValue: z.string().nullable(),
  newValue: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
})
const pageSchema = z.object({
  items: z.array(logSchema),
  totalCount: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})
export async function getActivityLogs(
  params: ActivityQuery,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get('/audit-logs', { params, signal })
  const envelope = z
    .object({ isSuccess: z.boolean(), result: z.unknown() })
    .parse(data)
  if (!envelope.isSuccess) throw new Error('Unable to load activity logs.')
  return pageSchema.parse(envelope.result)
}
export function activityApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Unable to connect to the server. Please try again.'
    if (status === 401) return 'Your session has expired. Please sign in again.'
    if (status === 403)
      return 'You do not have permission to view activity logs.'
    if (status === 429) return 'Too many requests. Please try again shortly.'
    if (status >= 500) return 'The activity service is temporarily unavailable.'
    return 'Unable to load activity logs. Please check the filter and try again.'
  }
  if (error instanceof z.ZodError)
    return 'The server returned an unexpected response.'
  return error instanceof Error
    ? error.message
    : 'Unable to load activity logs.'
}

const activityUserSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  email: z.string(),
})
export async function getActivityUser(id: string, signal?: AbortSignal) {
  try {
    const { data } = await axiosClient.get('/users/' + encodeURIComponent(id), {
      signal,
    })
    const response = z
      .object({ isSuccess: z.literal(true), result: activityUserSchema })
      .parse(data)
    return response.result
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}
