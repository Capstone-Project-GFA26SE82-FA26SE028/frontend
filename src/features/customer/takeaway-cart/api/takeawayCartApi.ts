import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { TakeawayCartLine, TakeawayCartResponse } from '../types/types'

function cartPath(restaurantId: string) {
  return '/restaurants/' + encodeURIComponent(restaurantId) + '/takeaway-cart'
}

function readCart(data: TakeawayCartResponse, restaurantId: string) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải giỏ mang đi.')
  if (
    data.result.restaurantId?.toLowerCase() !== restaurantId.toLowerCase() ||
    data.result.tableSessionId
  )
    throw new Error('Giỏ hàng không thuộc nhà hàng đã chọn.')
  return data.result
}

export async function getTakeawayCart(
  restaurantId: string,
  cartId?: string,
  signal?: AbortSignal,
) {
  if (cartId) {
    try {
      const { data } = await axiosClient.get<TakeawayCartResponse>(
        cartPath(restaurantId) + '/' + encodeURIComponent(cartId),
        { signal },
      )
      return readCart(data, restaurantId)
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 404)
        throw error
    }
  }
  // Backend returns the customer's existing unexpired cart, or creates one.
  const { data } = await axiosClient.post<TakeawayCartResponse>(
    cartPath(restaurantId),
    undefined,
    { signal },
  )
  return readCart(data, restaurantId)
}

export async function updateTakeawayCart(
  restaurantId: string,
  cartId: string,
  version: string,
  items: TakeawayCartLine[],
) {
  const { data } = await axiosClient.put<TakeawayCartResponse>(
    cartPath(restaurantId) + '/' + encodeURIComponent(cartId),
    { version, items },
  )
  return readCart(data, restaurantId)
}

export function takeawayCartError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Kết nối bị gián đoạn. Tải lại giỏ để kiểm tra món đã được lưu chưa.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể cập nhật giỏ hàng. Vui lòng tải lại.'
  }
  return error instanceof Error ? error.message : 'Không thể cập nhật giỏ hàng.'
}
 
export async function clearTakeawayCart(
  restaurantId: string,
  cartId: string,
  version: string,
) {
  const { data } = await axiosClient.delete<TakeawayCartResponse>(
    cartPath(restaurantId) + '/' + encodeURIComponent(cartId),
    { params: { version } },
  )
  return readCart(data, restaurantId)
}
