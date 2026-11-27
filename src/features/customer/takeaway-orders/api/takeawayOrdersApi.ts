import { axiosClient } from '../../../../api/axiosClient'
import type { TakeawayOrdersPage } from '../types/types'

type TakeawayOrdersResponse = {
  isSuccess: boolean
  message?: string
  result: TakeawayOrdersPage
}

export async function getTakeawayOrders(page: number, pageSize: number, signal: AbortSignal, status?: string) {
  const { data } = await axiosClient.get<TakeawayOrdersResponse>(
    '/customers/me/takeaway-orders',
    { params: { page, pageSize, status }, signal },
  )
  if (!data.isSuccess || !Array.isArray(data.result?.items))
    throw new Error(data.message || 'Không thể tải danh sách đơn mang đi.')
  return data.result
}
export async function cancelTakeawayOrder(restaurantId: string, orderId: string) {
  const path = `/restaurants/${restaurantId}/takeaway-orders/${orderId}`
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string
    result?: { status: string; paymentStatus: string | null; version: string }
  }>(path)
  if (!data.isSuccess || !data.result?.version)
    throw new Error(data.message || 'Không thể kiểm tra đơn hàng.')
  if (data.result.status !== 'PendingPayment' || data.result.paymentStatus === 'Paid')
    throw new Error('Đơn đã đổi trạng thái. Vui lòng kiểm tra lại.')

  const { data: response } = await axiosClient.post<{
    isSuccess: boolean
    message?: string
    result?: { status: string }
  }>(path + '/cancel', { version: data.result.version })
  if (!response.isSuccess || !response.result)
    throw new Error(response.message || 'Không thể hủy đơn.')
  return response.result.status
}
