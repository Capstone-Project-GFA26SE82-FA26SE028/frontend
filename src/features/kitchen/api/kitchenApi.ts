import axios from 'axios'
import { axiosClient } from '../../../api/axiosClient'

export type KitchenStatus = 'Pending' | 'Cooking' | 'Ready'
export type KitchenTask = {
  kitchenTaskId: string
  kitchenStationId: string
  kitchenStationName: string
  orderNumber: string
  tableSessionId: string
  nameSnapshot: string
  quantity: number
  note?: string | null
  status: string
  priority: number
  queuedAt: string
  cookingAt?: string | null
  readyAt?: string | null
  estimatedMinutes?: number | null
  dueAt?: string | null
  isLate: boolean
  version: string
  options: { optionId: string; name: string; quantity: number }[]
}
export type Station = {
  kitchenStationId: string
  kitchenStationCode: string
  kitchenStationName: string
}
export type Page<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
export type Summary = {
  pendingCount: number
  cookingCount: number
  readyCount: number
  avgCookingTimeMinutes: number
}
type Envelope<T> = { isSuccess: boolean; message?: string; result: T }

async function get<T>(path: string, params?: object, signal?: AbortSignal) {
  const { data } = await axiosClient.get<Envelope<T>>(path, { params, signal })
  if (!data.isSuccess)
    throw new Error(data.message || 'Unable to load kitchen data.')
  return data.result
}

export const kitchenApi = {
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
  tasks: (
    station: string,
    status: KitchenStatus,
    page: number,
    signal?: AbortSignal,
  ) =>
    get<Page<KitchenTask>>(
      '/kitchen-tasks',
      { kitchenStationId: station || undefined, status, page, pageSize: 30 },
      signal,
    ),
  summary: (station: string, signal?: AbortSignal) =>
    get<Summary>(
      '/kitchen-tasks/summary',
      { kitchenStationId: station || undefined },
      signal,
    ),
  detail: (id: string, signal?: AbortSignal) =>
    get<KitchenTask>(`/kitchen-tasks/${id}`, undefined, signal),
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
      throw new Error(data.message || 'Unable to update this item.')
    return data.result
  },
}

export function kitchenError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409)
      return 'This item has changed. Review the latest data before trying again.'
    if (error.response?.status === 403)
      return 'You do not have permission to perform this action.'
    if (!error.response)
      return 'Unable to connect to the server. Please try again.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to process your request. Please try again.'
  }
  return error instanceof Error ? error.message : 'Something went wrong.'
}
