import type { AuditEntry } from './types'
// Older entries have no actor; do not infer an authenticated identity.
export function auditPresentation(entry: AuditEntry) {
  const action = entry.action.toLocaleLowerCase('vi-VN')
  const badge =
    /khóa|vô hiệu|ngừng|tạm dừng|thu hồi/.test(action) &&
    !/mở khóa/.test(action)
      ? { label: 'Vô hiệu hóa', tone: 'bg-rose-100 text-rose-600' }
      : /xóa/.test(action)
        ? { label: 'Xóa', tone: 'bg-rose-100 text-rose-600' }
        : /tạo|thêm/.test(action)
          ? { label: 'Tạo', tone: 'bg-emerald-100 text-emerald-700' }
          : /kích hoạt|mở khóa/.test(action)
            ? { label: 'Kích hoạt', tone: 'bg-emerald-100 text-emerald-700' }
            : { label: 'Cập nhật', tone: 'bg-sky-100 text-sky-700' }
  return {
    ...badge,
    actor: entry.actor || 'Chưa ghi nhận',
    detail:
      entry.action +
      ' — ' +
      entry.target +
      (entry.reason && !entry.reason.trim().startsWith('{')
        ? ' · ' + entry.reason
        : ''),
  }
}
