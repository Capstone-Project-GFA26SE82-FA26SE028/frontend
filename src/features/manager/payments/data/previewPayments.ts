export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Cancelled'
export type PaymentMethod = 'Cash' | 'BankTransfer'

export type ManagerPayment = {
  id: string
  billNumber: string
  table: string
  channel: 'DineIn' | 'Takeaway'
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  createdAt: string
  paidAt: string | null
  cashier: string
  shift: string
  reference: string | null
  cashReceived: number | null
  note: string
}

// Explicit preview data until a restaurant-scoped payment listing API is available.
export const previewPayments: ManagerPayment[] = [
  ['1028', 'Bàn A03', 'DineIn', 'BankTransfer', 'Paid', 685000, '20:42', 'Nguyễn Minh Anh'],
  ['1027', 'Bàn A01', 'DineIn', 'Cash', 'Paid', 420000, '20:35', 'Trần Hoàng Nam'],
  ['1026', 'Mang đi', 'Takeaway', 'BankTransfer', 'Pending', 185000, '20:31', 'Nguyễn Minh Anh'],
  ['1025', 'Bàn B02', 'DineIn', 'BankTransfer', 'Paid', 1240000, '20:24', 'Nguyễn Minh Anh'],
  ['1024', 'Bàn A05', 'DineIn', 'Cash', 'Paid', 560000, '20:18', 'Trần Hoàng Nam'],
  ['1023', 'Mang đi', 'Takeaway', 'BankTransfer', 'Failed', 235000, '20:10', 'Nguyễn Minh Anh'],
  ['1022', 'Bàn B04', 'DineIn', 'BankTransfer', 'Pending', 890000, '20:06', 'Trần Hoàng Nam'],
  ['1021', 'Bàn A02', 'DineIn', 'Cash', 'Paid', 375000, '19:58', 'Trần Hoàng Nam'],
  ['1020', 'Bàn B01', 'DineIn', 'BankTransfer', 'Cancelled', 720000, '19:45', 'Nguyễn Minh Anh'],
  ['1019', 'Mang đi', 'Takeaway', 'Cash', 'Paid', 165000, '19:32', 'Nguyễn Minh Anh'],
  ['1018', 'Bàn A04', 'DineIn', 'BankTransfer', 'Paid', 945000, '19:20', 'Trần Hoàng Nam'],
  ['1017', 'Bàn B03', 'DineIn', 'Cash', 'Paid', 480000, '19:08', 'Nguyễn Minh Anh'],
].map(([number, table, channel, method, status, amount, time, cashier]) => {
  const createdAt = `2026-11-28T${time}:00+07:00`
  return {
    id: `PAY-261128-${number}`,
    billNumber: `HD-${number}`,
    table: String(table),
    channel: channel as ManagerPayment['channel'],
    method: method as PaymentMethod,
    status: status as PaymentStatus,
    amount: Number(amount),
    createdAt,
    paidAt: status === 'Paid' ? createdAt : null,
    cashier: String(cashier),
    shift: 'Ca tối · 17:00 – 23:00',
    reference: method === 'BankTransfer' ? `POS261128${number}` : null,
    cashReceived: method === 'Cash' && status === 'Paid' ? Math.ceil(Number(amount) / 100000) * 100000 : null,
    note: status === 'Failed' ? 'Giao dịch chưa được xác nhận thành công.'
      : status === 'Cancelled' ? 'Yêu cầu thanh toán đã được hủy.'
        : status === 'Pending' ? 'Đang chờ khách hoàn tất chuyển khoản.' : '',
  }
})
