import { axiosClient } from '../../../../api/axiosClient'
import type { BillingQueue, BillingTab } from '../types/types'

export async function getBillingQueue(
  restaurantId: string,
  tab: BillingTab,
  params: {
    cashShiftId: string
    page: number
    pageSize: number
    search?: string
    areaId?: string
  },
  signal: AbortSignal,
) {
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string | null
    result: BillingQueue
  }>(`/restaurants/${restaurantId}/payment-requests/${tab}`, { params, signal })
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải danh sách.')
  return data.result
}
