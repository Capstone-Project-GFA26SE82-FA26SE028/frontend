import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  SessionQuery,
  SessionRole,
  SessionResponse,
  SessionPage,
} from '../types/types'

function result<T>(envelope: SessionResponse<T>): T {
  if (!envelope.isSuccess) throw new Error('Không thể hoàn tất yêu cầu.')
  return envelope.result
}
export async function getSessions(params: SessionQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get<SessionResponse<SessionPage>>(
    '/sessions',
    { params, signal },
  )
  return result(data)
}
export async function getSessionRoles(
  signal?: AbortSignal,
): Promise<SessionRole[]> {
  const { data } = await axiosClient.get<SessionResponse<SessionRole[]>>(
    '/roles',
    { signal },
  )
  return result(data)
}
export async function revokeSession(id: string | 'all') {
  const path =
    id === 'all' ? '/sessions/me' : '/sessions/me/' + encodeURIComponent(id)
  const { data } = await axiosClient.delete<SessionResponse<unknown>>(path)
  const response = data
  if (!response.isSuccess)
    throw new Error('Không thể thu hồi phiên. Vui lòng thử lại.')
}
export function sessionApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (status >= 500)
      return 'Dịch vụ phiên đăng nhập đang gián đoạn. Vui lòng thử lại.'
    if (status === 401)
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    if (status === 403) return 'Bạn không có quyền truy cập các phiên này.'
    if (status === 404)
      return 'Phiên này không còn tồn tại hoặc không thuộc tài khoản của bạn.'
    if (status === 429) return 'Có quá nhiều yêu cầu. Vui lòng đợi rồi thử lại.'
    return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra bộ lọc và thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
