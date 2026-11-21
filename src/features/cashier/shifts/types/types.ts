export type CashRegister = {
  cashRegisterId: string
  restaurantId: string
  code: string
}

export type CashShift = {
  cashShiftId: string
  cashRegisterId: string
  restaurantId: string
  cashierUserRef: string
  openingCash: number
  openedAt: string
  status: string
}

export type ShiftWorkspace = {
  register: CashRegister | null
  shift: CashShift | null
}

export type CashShiftResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
