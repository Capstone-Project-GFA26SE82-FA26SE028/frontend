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

export type CashierBill = {
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
