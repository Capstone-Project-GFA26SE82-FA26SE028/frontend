import axios from 'axios'
import type {
  TableSession,
  GuestAccess,
  ResolvedTableQr,
  TableSessionResponse,
} from '../types/types'
// Guest cookies are independent of employee login and refresh-token interceptors.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})
function result<T>(data: TableSessionResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Unable to access this table.')
  return data.result
}
export async function resolveTableQr(token: string, signal?: AbortSignal) {
  const { data } = await client.post<TableSessionResponse<ResolvedTableQr>>(
    '/qr/resolve',
    { token },
    { signal },
  )
  return result(data)
}
export async function scanTable(token: string, signal?: AbortSignal) {
  const { data } = await client.post<TableSessionResponse<TableSession>>(
    '/table-sessions/scan',
    { token },
    { signal },
  )
  return result(data)
}
export async function joinTable(id: string, phoneOrCode: string) {
  const { data } = await client.post<TableSessionResponse<GuestAccess>>(
    '/table-sessions/' + encodeURIComponent(id) + '/guest-access/join',
    { phoneOrCode },
  )
  return result(data)
}
export async function getGuestAccess(id: string, signal?: AbortSignal) {
  const { data } = await client.get<TableSessionResponse<GuestAccess>>(
    '/table-sessions/' + encodeURIComponent(id) + '/guest-access/me',
    { signal },
  )
  return result(data)
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
  return error instanceof Error ? error.message : 'Unable to access this table.'
}
export function qrToken(hash: string, search: string) {
  const fragment = new URLSearchParams(hash.replace(/^#/, ''))
  const query = new URLSearchParams(search)
  return fragment.get('qr') || query.get('qr') || query.get('token') || ''
}
