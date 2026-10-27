import axios from 'axios'
import type { Dish, MenuPage, MenuResponse } from '../types/types'
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})
function result<T>(data: MenuResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Unable to load the menu.')
  return data.result
}
function normalizeDish(item: Dish): Dish {
  return {
    ...item,
    preparationTimeMinutes: item.preparationTimeMinutes ?? null,
  }
}
export async function getMenu(
  sessionId: string,
  filters: { search: string; categoryId: string },
  signal?: AbortSignal,
) {
  const items = new Map<string, Dish>()
  for (let page = 1; ; page++) {
    const { data } = await client.get<MenuResponse<MenuPage>>('/menu', {
      signal,
      params: {
        tableSessionId: sessionId,
        channel: 'DineIn',
        page,
        pageSize: 100,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
      },
    })
    const list = result(data)
    for (const item of list.items) items.set(item.itemId, normalizeDish(item))
    if (!list.items.length || list.page * list.pageSize >= list.totalCount)
      return [...items.values()]
  }
}
export async function getMenuItem(
  sessionId: string,
  id: string,
  signal?: AbortSignal,
) {
  const { data } = await client.get<MenuResponse<Dish>>(
    '/menu/' + encodeURIComponent(id),
    {
      signal,
      params: { tableSessionId: sessionId, channel: 'DineIn' },
    },
  )
  return normalizeDish(result(data))
}
export function menuError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to connect. Please try again.'
    if ([401, 403].includes(error.response.status))
      return 'Table access expired. Scan the QR code again to join.'
    if (error.response.status >= 500)
      return 'Menu service unavailable. Please try again later.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to load the menu.'
  }
  return error instanceof Error ? error.message : 'Unable to load the menu.'
}
