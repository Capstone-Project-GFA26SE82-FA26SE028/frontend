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
    throw new Error(data.message || 'Unable to load kitchen data.')
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
      throw new Error(data.message || 'Unable to update this item.')
    return data.result
  },
}

export function kdsError(error: unknown): string {
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
