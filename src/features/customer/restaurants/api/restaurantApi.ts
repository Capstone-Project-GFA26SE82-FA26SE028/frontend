import axios from 'axios'
import type { OnlineRestaurant, RestaurantResponse } from '../types/types'

// Public browsing must not inherit the staff token or selected restaurant header.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

export async function getOnlineRestaurants(
  page: number,
  pageSize: number,
  signal: AbortSignal,
) {
  const { data } = await client.get<RestaurantResponse>('/online/restaurants', {
    params: { page, pageSize },
    signal,
  })
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải danh sách nhà hàng.')
  return data.result
}

export async function getAllOnlineRestaurants(signal: AbortSignal) {
  const items: OnlineRestaurant[] = []
  for (let page = 1; ; page++) {
    const result = await getOnlineRestaurants(page, 100, signal)
    items.push(...result.items)
    if (
      !result.items.length ||
      result.page * result.pageSize >= result.totalCount
    )
      break
  }
  return { items, totalCount: items.length, page: 1, pageSize: items.length }
}

export function restaurantError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message.trim()) return message
    return 'Chưa thể tải danh sách nhà hàng. Vui lòng thử lại.'
  }
  return error instanceof Error
    ? error.message
    : 'Không thể tải danh sách nhà hàng.'
}
