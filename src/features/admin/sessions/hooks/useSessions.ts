import { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { matches } from '../../utils'
import { createMockSessions } from '../data/mockSessions'
export function useSessions(query: string) {
  const users = useAppSelector((s) => s.admin.users)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)
  const sessions = createMockSessions(users)
  const matchingSessions = sessions.filter(
    (s) =>
      matches(search, s.name, s.email, s.ip, s.device) &&
      matches(query, s.name, s.email, s.ip, s.device) &&
      (!role || s.role === role) &&
      (!date || s.time.startsWith(date)),
  )
  const rows = matchingSessions.filter(
    (s) => !status || String(s.active) === status,
  )
  const current = Math.min(page, Math.max(1, Math.ceil(rows.length / 6)))

  function resetFilters() {
    setSearch('')
    setStatus('')
    setRole('')
    setDate('')
    setPage(1)
  }
  return {
    search,
    status,
    role,
    date,
    roles: [...new Set(users.map((u) => u.role))],
    total: rows.length,
    current,
    visible: rows.slice((current - 1) * 6, current * 6),
    matchingCount: matchingSessions.length,
    activeCount: matchingSessions.filter((s) => s.active).length,
    setPage,
    resetFilters,
    onSearch: (v: string) => {
      setSearch(v)
      setPage(1)
    },
    onStatus: (v: string) => {
      setStatus(v)
      setPage(1)
    },
    onRole: (v: string) => {
      setRole(v)
      setPage(1)
    },
    onDate: (v: string) => {
      setDate(v)
      setPage(1)
    },
  }
}
