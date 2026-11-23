import { axiosClient } from '../../../../api/axiosClient'
import type { CashHandover } from '../types/types'

type Response<T> = { isSuccess: boolean; message?: string | null; result: T }

function readResult<T>(data: Response<T>) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể xử lý bàn giao tiền mặt.')
  return data.result
}

export async function findCashHandover(
  registerId: string,
  shiftId: string,
  billId: string,
  signal: AbortSignal,
) {
  const pageSize = 100
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<
      Response<{ items: CashHandover[]; totalCount: number }>
    >(`/cash-registers/${registerId}/cash-handovers`, {
      params: { page, pageSize },
      signal,
    })
    const result = readResult(data)
    const match = result.items.find(
      (item) =>
        item.billId === billId &&
        item.cashShiftId === shiftId &&
        item.status === 'Pending',
    )
    if (match) return match
    if (!result.items.length || page * pageSize >= result.totalCount)
      return null
  }
}

export async function confirmCashHandover(
  paymentId: string,
  confirmedAmount: number,
) {
  const { data } = await axiosClient.post<Response<CashHandover>>(
    `/cash-handovers/${paymentId}/confirm`,
    { confirmedAmount },
  )
  return readResult(data)
}
