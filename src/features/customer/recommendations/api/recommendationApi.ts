import axios from 'axios'
import type { RecommendationResponse } from '../types/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 100000,
})

export async function getRecommendations(
  sessionId: string,
  cartId: string,
  signal: AbortSignal,
) {
  const { data } = await client.post<RecommendationResponse>(
    `/ai/table-sessions/${encodeURIComponent(sessionId)}/carts/${encodeURIComponent(cartId)}/recommendations`,
    { limit: 3 },
    { signal },
  )
  if (!data.isSuccess)
    throw new Error(
      data.message || 'Không thể nhận gợi ý món. Vui lòng thử lại.',
    )
  if (
    data.result?.cartId !== cartId ||
    typeof data.result.cartVersion !== 'string' ||
    !Array.isArray(data.result.items)
  )
    throw new Error('Gợi ý không khớp với giỏ hàng. Vui lòng thử lại.')
  return data.result
}

export function recommendationError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được trợ lý. Vui lòng thử lại.'
    const status = error.response.status
    if (status === 401 || status === 403)
      return 'Phiên bàn đã hết hạn. Vui lòng quét lại QR.'
    if (status === 409)
      return 'Giỏ hàng hoặc thực đơn đã thay đổi. Vui lòng tải lại giỏ hàng.'
    if (status === 429) return 'Trợ lý đang bận. Vui lòng thử lại sau.'
    if (status === 504) return 'Trợ lý phản hồi quá lâu. Vui lòng thử lại.'
    if (status >= 500)
      return 'Gợi ý món chưa sẵn sàng. Bạn vẫn có thể tiếp tục đặt món.'
    return 'Chưa thể gợi ý cho giỏ hàng này. Vui lòng thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể nhận gợi ý món.'
}
