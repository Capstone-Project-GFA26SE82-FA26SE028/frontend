export const clock = (n: number) =>
  new Date(n).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
export const dateTime = (n: number) =>
  Number.isFinite(n)
    ? new Date(n).toLocaleString('vi-VN')
    : 'Chưa có hạn sử dụng'
export const elapsed = (start: number, now: number) =>
  `${Math.max(0, Math.floor((now - start) / 60000))} phút`
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
export const matches = (value: string, query: string) =>
  normalize(value).includes(normalize(query))

export type TicketTimeStatus = 'normal' | 'warning' | 'late'

export function getTicketTimeUrgency(
  ticket: {
    status: string
    created: number
    started?: number
    finished?: number
    dueAt?: number
    isLate?: boolean
    estimatedMinutes?: number | null
  },
  now: number,
  isLateExplicit = false,
): {
  status: TicketTimeStatus
  label: string
  elapsedMinutes: number
  progressPercent?: number
} {
  // Món đã hoàn thành
  if (ticket.status === 'Ready') {
    return {
      status: 'normal',
      label: ticket.finished ? `Xong lúc ${clock(ticket.finished)}` : 'Đã xong',
      elapsedMinutes: ticket.finished
        ? Math.max(0, Math.floor((now - ticket.finished) / 60000))
        : 0,
    }
  }

  // Món đang tạm hoãn (Hold)
  if (ticket.status === 'Hold') {
    return {
      status: 'normal',
      label: 'Đang giữ món',
      elapsedMinutes: Math.max(0, Math.floor((now - ticket.created) / 60000)),
    }
  }

  // Nếu đã được đánh dấu trễ giờ sẵn
  if (ticket.isLate || isLateExplicit) {
    const elapsedMinutes = Math.max(
      0,
      Math.floor((now - (ticket.started || ticket.created)) / 60000),
    )
    return {
      status: 'late',
      label: 'Trễ giờ',
      elapsedMinutes,
      progressPercent: 100,
    }
  }

  // Món đang nấu (Cooking)
  if (ticket.status === 'Cooking') {
    const started = ticket.started || ticket.created
    const elapsedMinutes = Math.max(0, Math.floor((now - started) / 60000))

    if (ticket.estimatedMinutes && ticket.estimatedMinutes > 0) {
      const targetMs = ticket.estimatedMinutes * 60000
      const elapsedMs = Math.max(0, now - started)
      const percent = Math.min(100, Math.round((elapsedMs / targetMs) * 100))

      if (elapsedMs >= targetMs) {
        return {
          status: 'late',
          label: `Quá giờ (+${Math.round((elapsedMs - targetMs) / 60000)}p)`,
          elapsedMinutes,
          progressPercent: 100,
        }
      }

      // Đổi màu vàng cam khi gần hết thời gian (đã nấu >= 70% hoặc còn <= 2 phút)
      if (percent >= 70 || targetMs - elapsedMs <= 2 * 60000) {
        const remainingMin = Math.max(1, Math.ceil((targetMs - elapsedMs) / 60000))
        return {
          status: 'warning',
          label: `Gần hết giờ (còn ${remainingMin}p)`,
          elapsedMinutes,
          progressPercent: percent,
        }
      }

      return {
        status: 'normal',
        label: `Đang nấu (${elapsedMinutes}/${ticket.estimatedMinutes}p)`,
        elapsedMinutes,
        progressPercent: percent,
      }
    }

    // Không có định mức phút: >= 10p là trễ, >= 7p là cảnh báo sắp trễ
    if (elapsedMinutes >= 10) {
      return {
        status: 'late',
        label: `Nấu quá lâu (${elapsedMinutes}p)`,
        elapsedMinutes,
        progressPercent: 100,
      }
    }
    if (elapsedMinutes >= 7) {
      return {
        status: 'warning',
        label: `Gần hết giờ (${elapsedMinutes}p)`,
        elapsedMinutes,
        progressPercent: 80,
      }
    }
    return {
      status: 'normal',
      label: `Đang nấu (${elapsedMinutes}p)`,
      elapsedMinutes,
      progressPercent: 40,
    }
  }

  // Món đang chờ (Pending)
  const waitMinutes = Math.max(0, Math.floor((now - ticket.created) / 60000))
  if (ticket.dueAt) {
    if (now >= ticket.dueAt) {
      return {
        status: 'late',
        label: 'Quá giờ hẹn',
        elapsedMinutes: waitMinutes,
        progressPercent: 100,
      }
    }
    if (ticket.dueAt - now <= 3 * 60000) {
      const remainingMin = Math.max(1, Math.ceil((ticket.dueAt - now) / 60000))
      return {
        status: 'warning',
        label: `Sắp tới giờ (còn ${remainingMin}p)`,
        elapsedMinutes: waitMinutes,
        progressPercent: 80,
      }
    }
  } else {
    if (waitMinutes >= 10) {
      return {
        status: 'late',
        label: `Chờ quá lâu (${waitMinutes}p)`,
        elapsedMinutes: waitMinutes,
        progressPercent: 100,
      }
    }
    if (waitMinutes >= 7) {
      return {
        status: 'warning',
        label: `Chờ gần 10p (${waitMinutes}p)`,
        elapsedMinutes: waitMinutes,
        progressPercent: 75,
      }
    }
  }

  return {
    status: 'normal',
    label: `Chờ nấu (${waitMinutes}p)`,
    elapsedMinutes: waitMinutes,
    progressPercent: 20,
  }
}

