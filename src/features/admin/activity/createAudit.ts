import type { AuditEntry } from './types'
export const audit = (
  action: string,
  target: string,
  reason = '',
): AuditEntry => ({
  actor: 'Quản trị viên (xem trước)',
  id: crypto.randomUUID(),
  time: new Date().toISOString(),
  action,
  target,
  reason,
})
