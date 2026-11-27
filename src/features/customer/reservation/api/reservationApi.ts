import axios from 'axios'
import type { ReservationFormValues } from '../schemas/reservationSchema'
import { reservationRequest } from '../utils/reservationRequest'

// Customer requests must not inherit a staff token or selected staff restaurant.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

export type CreatedReservation = {
  reservationId: string
  status: string
  contactName: string
  startAt: string
}

export async function createReservation(values: ReservationFormValues) {
  const { data } = await client.post<{
    isSuccess: boolean
    message?: string
    result: CreatedReservation
  }>('/reservations', reservationRequest(values))
  if (!data.isSuccess || !data.result?.reservationId)
    throw new Error(data.message || 'Không thể gửi yêu cầu đặt bàn.')
  return data.result
}

export function reservationError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    return error.response
      ? 'Không thể gửi yêu cầu. Vui lòng kiểm tra lại thông tin.'
      : 'Chưa nhận được phản hồi từ nhà hàng. Vui lòng liên hệ nhà hàng để kiểm tra trước khi gửi lại.'
  }
  return error instanceof Error ? error.message : 'Không thể gửi yêu cầu đặt bàn.'
}
