import axios from 'axios'
import { z } from 'zod'

export function notificationAccessDenied(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    [401, 403].includes(error.response?.status || 0)
  )
}

export function notificationError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return 'Phiên đăng nhập đã hết hạn.'
    if (error.response?.status === 403)
      return 'Bạn không có quyền xem thông báo này.'
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  if (error instanceof z.ZodError)
    return 'Dữ liệu thông báo không hợp lệ. Vui lòng tải lại.'
  return error instanceof Error ? error.message : 'Không thể tải thông báo.'
}

export function notificationTime(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function unreadLabel(count: number) {
  return count > 99 ? '99+' : String(count)
}
