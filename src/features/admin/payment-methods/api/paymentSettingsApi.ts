import { axiosClient } from '../../../../api/axiosClient'

export type PayOsConfigResponse = {
  restaurantId: string
  configured: boolean
  clientId: string
  returnUrl: string
  cancelUrl: string
  webhookUrl: string
  enabled: boolean
}

export type SavePayOsConfigInput = {
  clientId: string
  apiKey?: string
  checksumKey?: string
  returnUrl?: string
  cancelUrl?: string
  enabled: boolean
}

export async function getPayOsConfig(restaurantId: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string | null
    result: PayOsConfigResponse
  }>(`/restaurants/${restaurantId}/payment-settings/payos`, { signal })
  if (!data.isSuccess) {
    throw new Error(data.message || 'Không thể tải cấu hình PayOS.')
  }
  return data.result
}

export async function updatePayOsConfig(
  restaurantId: string,
  payload: SavePayOsConfigInput,
) {
  const { data } = await axiosClient.put<{
    isSuccess: boolean
    message?: string | null
    result: PayOsConfigResponse
  }>(`/restaurants/${restaurantId}/payment-settings/payos`, payload)
  if (!data.isSuccess) {
    throw new Error(data.message || 'Không thể cập nhật cấu hình PayOS.')
  }
  return data.result
}

export type TestPayOsQrResult = {
  accountName?: string | null
  accountNumber?: string | null
  bin?: string | null
  amount: number
  description: string
  orderCode: number | string
  qrCode?: string | null
  checkoutUrl?: string | null
}

export async function testPayOsQr(
  restaurantId: string,
  payload: { clientId: string; apiKey: string; checksumKey: string },
) {
  const { data } = await axiosClient.post<{
    isSuccess: boolean
    message?: string | null
    result: TestPayOsQrResult
  }>(`/restaurants/${restaurantId}/payment-settings/payos/test-qr`, payload)
  if (!data.isSuccess) {
    throw new Error(data.message || 'Không thể tạo mã QR từ PayOS.')
  }
  return data.result
}
