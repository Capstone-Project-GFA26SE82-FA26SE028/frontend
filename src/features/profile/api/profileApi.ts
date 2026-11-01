import axios from 'axios'
import { axiosClient } from '../../../api/axiosClient'
import type {
  Profile,
  ProfileResponse,
  ProfileValues,
  PasswordValues,
} from '../types/types'

function result<T>(data: ProfileResponse<T>) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể hoàn tất yêu cầu.')
  return data.result
}

export async function getProfile(signal?: AbortSignal) {
  const { data } = await axiosClient.get<ProfileResponse<Profile>>(
    '/users/me',
    { signal },
  )
  return result(data)
}

export async function updateProfile(values: ProfileValues) {
  const { data } = await axiosClient.put<ProfileResponse<Profile>>(
    '/users/me',
    values,
  )
  return result(data)
}

export async function changePassword(values: PasswordValues) {
  const { data } = await axiosClient.post<ProfileResponse<null>>(
    '/auth/change-password',
    values,
  )
  result(data)
}

export function profileError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (error.response.status >= 500)
      return 'Dịch vụ tài khoản đang gián đoạn. Vui lòng thử lại.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể hoàn tất yêu cầu. Vui lòng kiểm tra thông tin.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
