export type BillingTab = 'incoming' | 'paid'

export type CashHandover = {
  paymentId: string
  billId: string
  cashShiftId: string
  status: string
  amount: number
  cashReceived: number
  changeAmount: number
}

export type BillVoucherAdjustment = {
  billAdjustmentId: string
  voucherId: string | null
  type: string
  amount: number
  reason: string | null
}

export type CashierBill = {
  adjustments?: BillVoucherAdjustment[]
  status: string
  customerRef: string | null
  currency: string
  subTotal: number
  discountAmount: number
  vatAmount: number
  serviceAmount: number
  roundingAdjustment: number
  totalAmount: number
  warnings: string[]
  items: {
    billLineId: string
    item: { name: string }
    quantity: number
    unitPriceSnapshot: number
    lineTotal: number
  }[]
}

export type CashierTable = {
  tableId: string
  tableCode: string
  areaId: string
  areaName: string
}

export type BillingEntry = {
  checkoutId: string | null
  billId: string | null
  tableSessionId: string
  billCode: string | null
  totalAmount: number | null
  tables: CashierTable[]
  partySize: number
  openedAt: string | null
  submittedAt: string | null
  paidAt: string | null
  status: string
}

export type BillingQueue = {
  items: BillingEntry[]
  totalCount: number
  page: number
  pageSize: number
  cashShiftId: string
  totalAmount: number | null
  knownTotalAmount: number
  unbilledCount: number
}

export type CashierVoucher = {
  voucherId: string
  normalizedVoucherCode: string
  discountType: string
  discountValue: number
  maximumDiscount: number | null
  usageLimit: number | null
  currentUsage: number
  startAt: string
  endAt: string | null
}
export type BillPayOsPayment = {
  status: string
  qrCode: string | null
  expiresAt: string | null
  isVerifiedZero: boolean
  linkDetailsAvailable: boolean
}
