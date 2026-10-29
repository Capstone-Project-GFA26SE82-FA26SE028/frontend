import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  ActivityQuery,
  ActivityUser,
  ActivityResponse,
  ActivityPage,
} from '../types/types'
export async function getActivityLogs(
  params: ActivityQuery,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get<ActivityResponse<ActivityPage>>(
    '/audit-logs',
    { params, signal },
  )
  const envelope = data
  if (!envelope.isSuccess) throw new Error('Không thể tải nhật ký hoạt động.')
  return envelope.result
}
export function activityApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (status === 401)
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    if (status === 403) return 'Bạn không có quyền xem nhật ký hoạt động.'
    if (status === 429)
      return 'Có quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
    if (status >= 500) return 'Dịch vụ nhật ký hoạt động đang gián đoạn.'
    return 'Không thể tải nhật ký hoạt động. Vui lòng kiểm tra bộ lọc và thử lại.'
  }
  return error instanceof Error
    ? error.message
    : 'Không thể tải nhật ký hoạt động.'
}

export async function getActivityUser(id: string, signal?: AbortSignal) {
  try {
    const { data } = await axiosClient.get<ActivityResponse<ActivityUser>>(
      '/users/' + encodeURIComponent(id),
      {
        signal,
      },
    )
    const response = data
    if (!response.isSuccess)
      throw new Error('Không thể tải thông tin người dùng.')
    return response.result
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}
