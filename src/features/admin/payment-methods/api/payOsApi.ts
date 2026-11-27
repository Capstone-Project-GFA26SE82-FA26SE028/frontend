import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { PayOsConfiguration, PayOsCredentials, PayOsSettings, PayOsTestQr } from '../types/types'

type Response<T> = { isSuccess: boolean; message?: string; result: T }

function readResult<T>(data: Response<T>) {
  if (!data.isSuccess || data.result == null)
    throw new Error(data.message || 'Không thể xử lý cấu hình PayOS.')
  return data.result
}

export async function getPayOsConfiguration(restaurantId: string, signal: AbortSignal) {
  const { data } = await axiosClient.get<Response<PayOsConfiguration>>(
    `/restaurants/${restaurantId}/payment-settings/payos`, { signal },
  )
  return readResult(data)
}

export async function savePayOsConfiguration(restaurantId: string, values: PayOsSettings) {
  const { data } = await axiosClient.put<Response<PayOsConfiguration>>(
    `/restaurants/${restaurantId}/payment-settings/payos`, values,
  )
  return readResult(data)
}

export async function testPayOsConnection(restaurantId: string, request: PayOsCredentials | { useSavedConfiguration: true }) {
  const { data } = await axiosClient.post<Response<PayOsTestQr>>(
    `/restaurants/${restaurantId}/payment-settings/payos/test-qr`, request,
  )
  return readResult(data)
}

export function payOsError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    return 'Không thể xử lý yêu cầu PayOS.'
  }
  return error instanceof Error ? error.message : 'Không thể xử lý yêu cầu PayOS.'
}
