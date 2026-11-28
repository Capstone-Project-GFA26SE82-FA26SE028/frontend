import { axiosClient } from '../../../../api/axiosClient'
import type { CashierTakeawayOrder } from '../types/types'

type Response<T> = { isSuccess: boolean; message?: string; result: T }

export async function getOrdersAwaitingConfirmation(restaurantId: string, signal: AbortSignal) {
  const orders = new Map<string, CashierTakeawayOrder>()
  const pageSize = 50
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<Response<CashierTakeawayOrder[]>>(
      `/restaurants/${restaurantId}/takeaway-orders`,
      { params: { status: 'PendingConfirmation', page, pageSize }, signal },
    )
    if (!data.isSuccess || !Array.isArray(data.result))
      throw new Error(data.message || 'Không thể tải đơn online.')
    for (const order of data.result) orders.set(order.orderId, order)
    if (data.result.length < pageSize) return [...orders.values()]
  }
}

export async function acceptTakeawayOrder(restaurantId: string, order: CashierTakeawayOrder) {
  const { data } = await axiosClient.post<Response<CashierTakeawayOrder>>(
    `/restaurants/${restaurantId}/takeaway-orders/${order.orderId}/accept`,
    { version: order.version },
  )
  if (!data.isSuccess || !data.result)
    throw new Error(data.message || 'Không thể xác nhận đơn online.')
  return data.result
}
