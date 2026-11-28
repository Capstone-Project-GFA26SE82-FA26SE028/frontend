import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  KitchenSummary,
  KitchenBatch,
  ActiveRecipe,
  KitchenTask,
  KitchenItem,
  KitchenIngredient,
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
    const raw = await get<any>(
      path,
      { ...params, page, pageSize: 100 },
      signal,
    )
    if (Array.isArray(raw)) return raw
    const list: T[] = raw?.items || raw?.Items || []
    const totalCount: number = raw?.totalCount ?? raw?.TotalCount ?? list.length
    items.push(...list)
    if (items.length >= totalCount || list.length === 0)
      return items
  }
}

async function write<T>(method: 'post' | 'patch', path: string, body: object) {
  const { data } = await axiosClient[method]<Envelope<T>>(path, body)
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể cập nhật dữ liệu bếp.')
  return data.result
}

export const kdsApi = {
  summary: (stationId: string, signal?: AbortSignal) =>
    get<KitchenSummary>(
      '/kitchen-tasks/summary',
      { kitchenStationId: stationId },
      signal,
    ),
  batches: (stationId: string, signal?: AbortSignal) =>
    get<KitchenBatch[]>(
      '/kitchen-tasks/batches',
      { kitchenStationId: stationId },
      signal,
    ),
  task: (id: string, signal?: AbortSignal) =>
    get<KitchenTask>(`/kitchen-tasks/${id}`, undefined, signal),
  batch: (action: 'start' | 'complete', taskIds: string[]) =>
    write<{ affectedCount: number; status: string }>(
      'post',
      `/kitchen-tasks/batches/${action}`,
      { taskIds },
    ),
  remake: (id: string, reason: string) =>
    write<KitchenTask>('post', `/kitchen-tasks/${id}/remake`, { reason }),
  fire: (tableSessionId: string, orderId: string, course: string) =>
    write<{ activatedCount: number; message: string }>(
      'post',
      '/kitchen-tasks/fire-course',
      { tableSessionId, orderId, course },
    ),
  availability: (item: KitchenItem, availability: string) =>
    write<KitchenItem>('patch', `/items/${item.itemId}/status`, {
      availability,
      version: item.version,
    }),
  allTasks: (signal?: AbortSignal) =>
    kdsList<KitchenTask>('/kitchen-tasks', signal, { status: 'all' }),
  items: (signal?: AbortSignal) => kdsList<KitchenItem>('/items', signal),
  ingredients: (signal?: AbortSignal) =>
    kdsList<KitchenIngredient>('/ingredients', signal),
  activeRecipe: (itemId: string, signal?: AbortSignal) =>
    get<ActiveRecipe>(`/items/${itemId}/recipes/active`, undefined, signal),
  activeOptionRecipe: (optionId: string, signal?: AbortSignal) =>
    get<ActiveRecipe>(`/options/${optionId}/recipes/active`, undefined, signal),
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
    if (error.response?.status === 409) {
      const message = error.response.data?.message
      return typeof message === 'string' && message.trim()
        ? message
        : 'Món này đã thay đổi. Vui lòng kiểm tra dữ liệu mới nhất trước khi thử lại.'
    }
    if (error.response?.status === 403)
      return 'Bạn không có quyền thực hiện thao tác này.'
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể xử lý yêu cầu. Vui lòng thử lại.'
  }
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi.'
}
