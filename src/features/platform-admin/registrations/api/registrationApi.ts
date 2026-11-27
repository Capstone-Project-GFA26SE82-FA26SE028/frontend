import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { AuthResponse } from '../../../auth/types/types'
import type { RegistrationReceipt } from '../../../auth/api/restaurantRegistrationApi'
import type { Restaurant } from '../../restaurants/types/types'

export type Registration = RegistrationReceipt & {
  restaurant: Restaurant
  email: string
  applicantUserId: string
  submittedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
}
export type RegistrationPage = {
  items: Registration[]
  totalCount: number
  page: number
  pageSize: number
}
export type RegistrationStatus = RegistrationReceipt['status']
const path = '/restaurant-registrations'

function unwrap<T>(data: AuthResponse<T>) {
  if (!data.isSuccess) throw new Error(data.message || 'Không thể xử lý hồ sơ.')
  return data.result
}
export async function getRegistrations(
  page: number,
  status: RegistrationStatus | '',
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get<AuthResponse<RegistrationPage>>(path, {
    params: { page, pageSize: 10, status: status || undefined },
    signal,
  })
  return unwrap(data)
}
export async function getRegistration(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<AuthResponse<Registration>>(
    `${path}/${encodeURIComponent(id)}`,
    { signal },
  )
  return unwrap(data)
}
export async function approveRegistration(id: string) {
  const { data } = await axiosClient.post<AuthResponse<RegistrationReceipt>>(
    `${path}/${encodeURIComponent(id)}/approve`,
  )
  return unwrap(data)
}
export async function getRegistrationDocument(
  id: string,
  kind: 'business' | 'food-safety',
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get<Blob>(
    `${path}/${encodeURIComponent(id)}/documents/${kind}`,
    { responseType: 'blob', signal },
  )
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(data.type))
    throw new Error('Giấy tờ trả về không phải định dạng ảnh được hỗ trợ.')
  return data
}
export function registrationError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (error.response.status === 403)
      return 'Bạn không có quyền xem hoặc duyệt hồ sơ.'
    return 'Không thể xử lý hồ sơ. Vui lòng tải lại để kiểm tra trạng thái trước khi thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể xử lý hồ sơ.'
}
