import { axiosClient } from '../../../../api/axiosClient'
import type { CashierBill } from '../types/types'

export async function getCashierBill(billId: string, signal: AbortSignal) {
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string | null
    result: CashierBill
  }>(`/bills/${billId}`, { signal })
  if (!data.isSuccess) throw new Error(data.message || 'Không thể tải hóa đơn.')
  return data.result
}
