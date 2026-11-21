import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  CashRegister,
  CashShift,
  CashShiftResponse,
  ShiftWorkspace,
} from '../types/types'

function result<T>(data: CashShiftResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải ca làm việc.')
  return data.result
}

export async function getShiftWorkspace(
  restaurantId: string,
  signal?: AbortSignal,
): Promise<ShiftWorkspace> {
  const { data } = await axiosClient.get<
    CashShiftResponse<{ items: CashRegister[]; totalCount: number }>
  >('/cash-registers', {
    params: { restaurantId, page: 1, pageSize: 2 },
    signal,
  })
  const registers = result(data)
  if (registers.totalCount > 1)
    throw new Error(
      'Nhà hàng có nhiều quầy thu ngân. Liên hệ quản lý để xác định quầy mặc định.',
    )
  const register = registers.items[0] || null
  if (!register) return { register: null, shift: null }
  try {
    const response = await axiosClient.get<CashShiftResponse<CashShift>>(
      `/cash-registers/${register.cashRegisterId}/shifts/current`,
      { signal },
    )
    return { register, shift: result(response.data) }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return { register, shift: null }
    throw error
  }
}

export async function openCashShift(restaurantId: string, openingCash: number) {
  const { data } = await axiosClient.post<CashShiftResponse<CashShift>>(
    `/restaurants/${restaurantId}/cash-shifts/open`,
    { openingCash },
  )
  return result(data)
}

export function cashShiftError(error: unknown) {
  if (axios.isAxiosError(error))
    return (
      error.response?.data?.message ||
      'Không kết nối được máy chủ. Kiểm tra ca trước khi thử lại.'
    )
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
