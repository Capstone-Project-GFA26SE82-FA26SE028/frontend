import type { BillingEntry } from '../types/types'

export const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})
export const STATUS_NAMES: Record<string, string> = {
  Submitted: 'Chờ lập hóa đơn',
  Prepared: 'Đã lập hóa đơn',
  Presented: 'Đã trình hóa đơn',
  Unpaid: 'Chờ thanh toán',
  Paid: 'Đã thanh toán',
}

export function entryKey(entry: BillingEntry) {
  return entry.billId ?? entry.checkoutId ?? entry.tableSessionId
}

export function tableName(entry: BillingEntry) {
  return (
    entry.tables.map((table) => table.tableCode).join(' · ') || 'Chưa có mã bàn'
  )
}
