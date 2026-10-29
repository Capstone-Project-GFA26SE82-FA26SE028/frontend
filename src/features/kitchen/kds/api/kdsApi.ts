import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  ActiveRecipe,
  KitchenTask,
  KitchenItem,
  Station,
  Page,
} from '../types'

type Envelope<T> = { isSuccess: boolean; message?: string; result: T }

export function kdsAccessDenied(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    [401, 403].includes(error.response?.status || 0)
  )
}

// Permission failures need a session/configuration change, not automatic retries.
export const kdsReadPolicy = {
  retryOnMount: false,
  retry: (failureCount: number, error: unknown) =>
    !kdsAccessDenied(error) && failureCount < 1,
  refetchOnWindowFocus: (query: { state: { error: unknown } }) =>
    !kdsAccessDenied(query.state.error),
  refetchOnReconnect: (query: { state: { error: unknown } }) =>
    !kdsAccessDenied(query.state.error),
  refetchOnMount: (query: { state: { error: unknown } }) =>
    !kdsAccessDenied(query.state.error),
}

export function kdsPollInterval(milliseconds: number) {
  return (query: { state: { error: unknown } }) =>
    kdsAccessDenied(query.state.error) ? false : milliseconds
}

async function get<T>(path: string, params?: object, signal?: AbortSignal) {
  const { data } = await axiosClient.get<Envelope<T>>(path, { params, signal })
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải dữ liệu bếp.')
  return data.result
}

export async function kdsList<T>(
  path: string,
  signal?: AbortSignal,
  params?: object,
) {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const result = await get<Page<T>>(
      path,
      { ...params, page, pageSize: 100 },
      signal,
    )
    items.push(...result.items)
    if (items.length >= result.totalCount || result.items.length === 0)
      return items
  }
}

export const kdsApi = {
  allTasks: (signal?: AbortSignal) =>
    kdsList<KitchenTask>('/kitchen-tasks', signal, { status: 'all' }),
  items: (signal?: AbortSignal) => kdsList<KitchenItem>('/items', signal),
  activeRecipe: (itemId: string, signal?: AbortSignal) =>
    get<ActiveRecipe>(`/items/${itemId}/recipes/active`, undefined, signal),
  async stations(signal?: AbortSignal) {
    const items: Station[] = []
    for (let page = 1; ; page++) {
      const result = await get<Page<Station>>(
        '/kitchen-stations',
        { page, pageSize: 100, isActive: true },
        signal,
      )
      items.push(...result.items)
      if (items.length >= result.totalCount || result.items.length === 0)
        return items
    }
  },
  async update(
    task: KitchenTask,
    action: 'status' | 'priority',
    value: string | number,
  ) {
    const { data } = await axiosClient.patch<Envelope<KitchenTask>>(
      `/kitchen-tasks/${task.kitchenTaskId}/${action}`,
      { [action]: value, version: task.version },
    )
    if (!data.isSuccess)
      throw new Error(data.message || 'Không thể cập nhật món này.')
    return data.result
  },
}

export function kdsError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409)
      return 'Món này đã thay đổi. Vui lòng kiểm tra dữ liệu mới nhất trước khi thử lại.'
    if (error.response?.status === 403)
      return 'Bạn không có quyền thực hiện thao tác này.'
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể xử lý yêu cầu. Vui lòng thử lại.'
  }
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi.'
}
