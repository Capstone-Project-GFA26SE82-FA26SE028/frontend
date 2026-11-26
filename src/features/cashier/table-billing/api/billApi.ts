import { axiosClient } from '../../../../api/axiosClient'
import type { CashierBill } from '../types/types'

export async function prepareCashierBill(
  tableSessionId: string,
  checkoutId: string,
) {
  const { data } = await axiosClient.post<{
    isSuccess: boolean
    message?: string | null
    result: { bill: CashierBill & { billId: string } }
  }>(`/table-sessions/${tableSessionId}/payment-requests/${checkoutId}/prepare`)
  if (!data.isSuccess) throw new Error(data.message || 'Không thể lập hóa đơn.')
  return data.result.bill
}

export async function getCashierBill(billId: string, signal: AbortSignal) {
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string | null
    result: CashierBill
  }>(`/bills/${billId}`, { signal })
  if (!data.isSuccess) throw new Error(data.message || 'Không thể tải hóa đơn.')
  return data.result
}

export async function saveBillLoyaltyPhone(billId: string, phoneNumber: string) {
  const { data } = await axiosClient.post<{
    isSuccess: boolean
    message?: string | null
    result: CashierBill
  }>(`/bills/${billId}/customer`, { phoneNumber })
  if (!data.isSuccess) {
    throw new Error(data.message || 'Không thể gán khách vào hóa đơn.')
  }
  return data.result
}
