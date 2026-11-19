import { axiosClient } from '../../../../api/axiosClient'
import axios from 'axios'
import type { RestaurantStaffResponse, RestaurantStaff } from '../types/types'

export function restaurantStaffError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (error.response.status >= 500)
      return 'Dịch vụ phân công nhân viên đang gián đoạn.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể cập nhật phân công nhân viên.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}

function result<T>(data: RestaurantStaffResponse<T>) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể cập nhật nhân viên nhà hàng.')
  return data.result
}

function staffUrl(restaurantId: string) {
  return '/restaurants/' + encodeURIComponent(restaurantId) + '/staff'
}

export async function getRestaurantStaff(
  restaurantId: string,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get<
    RestaurantStaffResponse<RestaurantStaff[]>
  >(staffUrl(restaurantId), { signal })
  return result(data)
}

export async function assignRestaurantStaff(
  restaurantId: string,
  userIdRef: string,
) {
  const { data } = await axiosClient.post<
    RestaurantStaffResponse<RestaurantStaff>
  >(staffUrl(restaurantId), { userIdRef })
  return result(data)
}

export async function removeRestaurantStaff(
  restaurantId: string,
  userId: string,
) {
  const { data } = await axiosClient.delete<
    RestaurantStaffResponse<RestaurantStaff>
  >(staffUrl(restaurantId) + '/' + encodeURIComponent(userId))
  return result(data)
}
