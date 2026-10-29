import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  Restaurant,
  RestaurantQuery,
  RestaurantResponse,
  RestaurantPage,
} from '../types/types'
import type { RestaurantValues } from '../schemas/restaurantSchema'
function result<T>(envelope: RestaurantResponse<T>): T {
  if (!envelope.isSuccess) throw new Error('Không thể hoàn tất yêu cầu.')
  return envelope.result
}
export async function getRestaurants(
  params: RestaurantQuery,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get<RestaurantResponse<RestaurantPage>>(
    '/restaurants',
    { params, signal },
  )
  return result(data)
}
export async function getRestaurant(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<RestaurantResponse<Restaurant>>(
    '/restaurants/' + encodeURIComponent(id),
    { signal },
  )
  return result(data)
}
export async function saveRestaurant(values: RestaurantValues, id?: string) {
  const body = {
    ...values,
    taxCode: values.taxCode || null,
    logoUrl: values.logoUrl || null,
  }
  const { data } = id
    ? await axiosClient.put<RestaurantResponse<Restaurant>>(
        '/restaurants/' + encodeURIComponent(id),
        body,
      )
    : await axiosClient.post<RestaurantResponse<Restaurant>>(
        '/restaurants',
        body,
      )
  return result(data)
}
export function restaurantError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (status >= 500) return 'Dịch vụ nhà hàng đang gián đoạn.'
    if (status === 401) return 'Phiên đăng nhập đã hết hạn.'
    if (status === 403) return 'Bạn không có quyền quản lý nhà hàng.'
    if (status === 404)
      return 'Nhà hàng này không còn tồn tại. Vui lòng làm mới danh sách.'
    if (status === 429)
      return 'Có quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
    return typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể lưu. Vui lòng kiểm tra thông tin và thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
