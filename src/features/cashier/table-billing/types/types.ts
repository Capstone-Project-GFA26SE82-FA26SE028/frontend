export type BillingTab = 'incoming' | 'paid'

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
