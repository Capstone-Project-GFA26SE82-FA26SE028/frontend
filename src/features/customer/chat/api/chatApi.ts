import axios from 'axios'
import type { ChatResponse, ChatTurn } from '../types/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 100000,
})

export async function sendChat(
  sessionId: string,
  message: string,
  history: ChatTurn[],
  signal: AbortSignal,
) {
  const { data } = await client.post<ChatResponse>(
    `/ai/table-sessions/${encodeURIComponent(sessionId)}/chat`,
    { message, history },
    { signal },
  )
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể nhận câu trả lời.')
  if (
    typeof data.result?.answer !== 'string' ||
    !Array.isArray(data.result.items)
  )
    throw new Error('Phản hồi tư vấn không hợp lệ. Vui lòng thử lại.')
  return data.result
}

export function chatError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được trợ lý. Vui lòng thử lại.'
    const status = error.response.status
    if ([401, 403].includes(status))
      return 'Phiên bàn đã hết hạn. Vui lòng quét lại QR.'
    if (status === 429) return 'Trợ lý đang bận. Vui lòng thử lại sau.'
    if (status === 504) return 'Trợ lý trả lời quá lâu. Vui lòng thử lại.'
    if (status >= 500)
      return 'Dịch vụ tư vấn chưa sẵn sàng. Vui lòng thử lại sau.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể gửi câu hỏi.'
  }
  return error instanceof Error ? error.message : 'Không thể gửi câu hỏi.'
}
