import axios from 'axios'
import type {
  CustomerMember,
  LoyaltyResponse,
  LoyaltyTier,
} from '../types/types'

// Customer lookup is separate from employee login and its bearer-token interceptor.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  withCredentials: true,
})

function result<T>(response: LoyaltyResponse<T>): T {
  if (!response.isSuccess || response.result == null)
    throw new Error(response.message || 'Không thể tải thông tin thành viên.')
  return response.result
}

export async function getMember(phone: string, signal: AbortSignal) {
  const { data } = await client.get<LoyaltyResponse<CustomerMember>>(
    '/customers/by-phone/' + encodeURIComponent(phone),
    { signal },
  )
  return result(data)
}

export async function getLoyaltyTiers(signal: AbortSignal) {
  const { data } = await client.get<LoyaltyResponse<LoyaltyTier[]>>(
    '/loyalty/tiers',
    { signal },
  )
  return result(data)
}

export function loyaltyError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  return error instanceof Error
    ? error.message
    : 'Không thể tải thông tin thành viên.'
}
