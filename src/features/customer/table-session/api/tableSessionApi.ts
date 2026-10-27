import axios from 'axios'
import { z } from 'zod'
// Guest cookies are independent of employee login and refresh-token interceptors.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})
export const tableSessionSchema = z.object({
  tableSessionId: z.guid(),
  tableId: z.guid(),
  tableCode: z.string(),
  areaId: z.guid(),
  restaurantId: z.guid(),
  status: z.string(),
  openedAt: z.string(),
  isNewSession: z.boolean(),
})
const accessSchema = z.object({
  tableSessionId: z.guid(),
  expiresAt: z.string().datetime({ offset: true }),
})
export type TableSession = z.infer<typeof tableSessionSchema>
function result<T>(data: unknown, schema: z.ZodType<T>) {
  const value = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!value.isSuccess)
    throw new Error(value.message || 'Unable to access this table.')
  return schema.parse(value.result)
}
export async function resolveTableQr(token: string, signal?: AbortSignal) {
  const { data } = await client.post('/qr/resolve', { token }, { signal })
  return result(data, z.object({ tableId: z.guid() }))
}
export async function scanTable(token: string, signal?: AbortSignal) {
  const { data } = await client.post(
    '/table-sessions/scan',
    { token },
    { signal },
  )
  return result(data, tableSessionSchema)
}
export async function joinTable(id: string, phoneOrCode: string) {
  const { data } = await client.post(
    '/table-sessions/' + encodeURIComponent(id) + '/guest-access/join',
    { phoneOrCode },
  )
  return result(data, accessSchema)
}
export async function getGuestAccess(id: string, signal?: AbortSignal) {
  const { data } = await client.get(
    '/table-sessions/' + encodeURIComponent(id) + '/guest-access/me',
    { signal },
  )
  return result(data, accessSchema)
}
export function sessionError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to connect. Please try again.'
    if (error.response.status >= 500)
      return 'Table service unavailable. Please try again later.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to access this table.'
  }
  return error instanceof z.ZodError
    ? 'Unexpected server response.'
    : error instanceof Error
      ? error.message
      : 'Unable to access this table.'
}
export function qrToken(hash: string, search: string) {
  const fragment = new URLSearchParams(hash.replace(/^#/, ''))
  const query = new URLSearchParams(search)
  return fragment.get('qr') || query.get('qr') || query.get('token') || ''
}
