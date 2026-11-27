import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'

import type { TakeawayOrder, TakeawayOrderRequest } from '../types/types'

type OrderResponse = { isSuccess: boolean; message?: string; result: TakeawayOrder }

function readOrder(data: OrderResponse) {
  if (!data.isSuccess || !data.result?.orderId)
    throw new Error(data.message || 'Không thể tải đơn mang đi.')
  return data.result
}

export async function createTakeawayOrder(restaurantId: string, request: TakeawayOrderRequest, key: string) {
  const { data } = await axiosClient.post<OrderResponse>(
    `/restaurants/${restaurantId}/takeaway-orders`,
    request,
    { headers: { 'Idempotency-Key': key } },
  )
  return readOrder(data)
}

export async function getTakeawayOrder(restaurantId: string, orderId: string, signal: AbortSignal) {
  const { data } = await axiosClient.get<OrderResponse>(
    `/restaurants/${restaurantId}/takeaway-orders/${orderId}`,
    { signal },
  )
  return readOrder(data)
}

export function takeawayOrderError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (!error.response) return 'Kết nối bị gián đoạn. Bấm thử lại để tiếp tục yêu cầu vừa gửi.'
    return 'Không thể xử lý đơn mang đi. Vui lòng thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể xử lý đơn mang đi.'
}