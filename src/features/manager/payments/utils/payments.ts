import type { ManagerPayment } from '../data/previewPayments'

export const paymentStatus = {
  Paid: { label: 'Thành công', tone: 'green' },
  Pending: { label: 'Chờ thanh toán', tone: 'amber' },
  Failed: { label: 'Thất bại', tone: 'red' },
  Cancelled: { label: 'Đã hủy', tone: 'slate' },
} as const

export const methodLabels = { Cash: 'Tiền mặt', BankTransfer: 'Chuyển khoản PayOS' }
export const money = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
export const paymentTime = (value: string) => new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
}).format(new Date(value))

export function exportPayments(payments: ManagerPayment[]) {
  const rows = [
    ['Mã giao dịch', 'Hóa đơn', 'Bàn / Kênh', 'Phương thức', 'Trạng thái', 'Số tiền (VND)', 'Thời gian tạo', 'Thời gian thanh toán', 'Thu ngân'],
    ...payments.map((payment) => [payment.id, payment.billNumber, payment.table, methodLabels[payment.method],
      paymentStatus[payment.status].label, payment.amount, paymentTime(payment.createdAt),
      payment.paidAt ? paymentTime(payment.paidAt) : '', payment.cashier]),
  ]
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'giao-dich-thanh-toan-minh-hoa.csv'
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
