import type { AdminUser } from '../../users/types'
import type { LoginSession } from '../types'
// Preview sessions only; these are not real authentication records.
export function createMockSessions(users: AdminUser[]): LoginSession[] {
  return users.flatMap((u, i) =>
    [0, 1].map((n) => ({
      id: u.id + '-' + n,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active && n === 0,
      device: n ? 'Safari · iPhone' : 'Chrome · Windows',
      ip: '192.0.2.' + (i + 10),
      time: '2026-10-0' + (9 - n) + 'T0' + (i % 9) + ':30:00+07:00',
    })),
  )
}
