import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { StaffTransfer, UserResponse } from '../types/types'

function result(data: UserResponse<StaffTransfer>) {
  if (
    data.result &&
    ['Pending', 'Completed', 'Rejected'].includes(data.result.status)
  )
    return data.result
  throw new Error(data.message || 'Chưa đọc được kết quả chuyển nhà hàng.')
}

export async function transferStaff(
  userId: string,
  restaurantId: string,
  key: string,
) {
  try {
    const { data } = await axiosClient.post<UserResponse<StaffTransfer>>(
      `/users/${encodeURIComponent(userId)}/restaurant-transfer`,
      { restaurantId },
      { headers: { 'Idempotency-Key': key } },
    )
    return result(data)
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      error.response.data?.result
    )
      return result(error.response.data)
    throw error
  }
}

export async function getStaffTransfer(id: string, signal?: AbortSignal) {
  try {
    const { data } = await axiosClient.get<UserResponse<StaffTransfer>>(
      `/staff-transfers/${encodeURIComponent(id)}`,
      { signal },
    )
    return result(data)
  } catch (error) {
    // Rejected transfers are returned as HTTP 409, with the final result.
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      error.response.data?.result
    )
      return result(error.response.data)
    throw error
  }
}

export function staffTransferError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (!error.response)
      return 'Chưa kết nối được máy chủ. Kiểm tra kết quả trước khi thử lại.'
    return 'Chưa lấy được kết quả chuyển nhà hàng. Vui lòng thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể chuyển nhân viên.'
}
