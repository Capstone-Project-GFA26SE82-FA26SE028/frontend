import axios from 'axios'
import type { CustomerOrder, OrderResponse } from '../types/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})

function path(sessionId: string) {
  return '/table-sessions/' + encodeURIComponent(sessionId) + '/orders'
}

function result<T>(data: OrderResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Unable to load your orders.')
  return data.result
}

export async function getCustomerOrders(
  sessionId: string,
  page: number,
  signal?: AbortSignal,
) {
  const { data } = await client.get<OrderResponse<CustomerOrder[]>>(
    path(sessionId),
    {
      params: { page, pageSize: 20 },
      signal,
    },
  )
  const orders = result(data)
  if (orders.some((order) => order.tableSessionId !== sessionId))
    throw new Error(
      'These orders belong to another table session. Scan your table QR again.',
    )
  return orders
}

export async function getCustomerOrder(
  sessionId: string,
  orderId: string,
  signal?: AbortSignal,
) {
  const { data } = await client.get<OrderResponse<CustomerOrder>>(
    path(sessionId) + '/' + encodeURIComponent(orderId),
    { signal },
  )
  const order = result(data)
  if (order.tableSessionId !== sessionId || order.orderId !== orderId)
    throw new Error(
      'This order does not match your table session. Reload and try again.',
    )
  return order
}

export function orderTrackingError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if ([401, 403].includes(error.response?.status ?? 0))
      return 'Table access expired. Scan your table QR code again.'
    if (!error.response)
      return 'Unable to connect. Check your connection and reload your orders.'
    if (error.response.status >= 500)
      return 'Order service is temporarily unavailable. Please try again.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to load your orders.'
  }
  return error instanceof Error ? error.message : 'Unable to load your orders.'
}
