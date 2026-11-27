import { axiosClient } from '../../../../api/axiosClient'
import type { BillPayOsPayment, CashierBill, CashierVoucher } from '../types/types'

export async function createBillPayOsPayment(
  billId: string,
  checkoutId: string,
  cashShiftId: string,
  requestKey: string,
) {
  const { data } = await axiosClient.post<{
    isSuccess: boolean
    message?: string | null
    result: BillPayOsPayment
  }>(`/bills/${billId}/payments/payos`, { checkoutId, cashShiftId }, {
    headers: { 'Idempotency-Key': requestKey },
  })
  if (!data.isSuccess) throw new Error(data.message || 'Không thể tạo QR PayOS.')
  return data.result
}

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

export async function applyBillVoucher(billId: string, voucherCode: string) {
  const { data } = await axiosClient.post<{ isSuccess: boolean; message?: string; result: CashierBill }>(
    `/bills/${billId}/voucher`,
    { voucherCode },
  )
  if (!data.isSuccess || !data.result) throw new Error(data.message || 'Không thể áp dụng mã.')
  return data.result
}

export async function removeBillVoucher(billId: string, voucherId: string) {
  const { data } = await axiosClient.delete<{ isSuccess: boolean; message?: string; result: CashierBill }>(
    `/bills/${billId}/voucher/${voucherId}`,
  )
  if (!data.isSuccess || !data.result) throw new Error(data.message || 'Không thể gỡ mã.')
  return data.result
}
export async function getCashierVouchers(restaurantId: string, page: number, signal: AbortSignal) {
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string
    result: { items: CashierVoucher[]; totalCount: number; page: number; pageSize: number }
  }>('/vouchers', {
    headers: { 'x-restaurant-id': restaurantId },
    params: { isActive: true, page, pageSize: 10 },
    signal,
  })
  if (!data.isSuccess || !data.result) throw new Error(data.message || 'Không thể tải danh sách mã.')
  return data.result
}
