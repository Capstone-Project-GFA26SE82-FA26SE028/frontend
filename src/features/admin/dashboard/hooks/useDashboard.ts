import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
export function useDashboard() {
  const users = useAppSelector((s) => s.admin.users),
    tables = useAppSelector((s) => s.adminTables),
    areas = useAppSelector((s) => s.adminAreas),
    fees = useAppSelector((s) => s.adminTaxFees),
    methods = useAppSelector((s) => s.adminPaymentMethods)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])
  const currentFees = [...fees]
    .filter((f) => new Date(f.effectiveAt).getTime() <= now)
    .sort(
      (a, b) =>
        new Date(b.effectiveAt).getTime() - new Date(a.effectiveAt).getTime(),
    )[0]
  const activeUsers = users.filter((u) => u.active).length
  const current = new Date(now)
  const newUsers = users.filter((u) => {
    const date = new Date(u.created)
    return (
      date.getFullYear() === current.getFullYear() &&
      date.getMonth() === current.getMonth() &&
      date.getTime() <= now
    )
  }).length
  const available = (t: (typeof tables)[number]) =>
    t.active && areas.some((a) => a.id === t.areaId && a.active)
  return {
    users,
    activeUsers,
    newUsers,
    tables,
    areas,
    currentFees,
    methods,
    tableStatus: [
      {
        name: 'Đang sử dụng',
        value: tables.filter((t) => available(t) && t.busy).length,
        color: '#43bf73',
      },
      {
        name: 'Trống',
        value: tables.filter((t) => available(t) && !t.busy).length,
        color: '#e2e8f0',
      },
      {
        name: 'Ngừng hoạt động',
        value: tables.filter((t) => !available(t)).length,
        color: '#fb777b',
      },
    ],
    userStatus: [
      { name: 'Hoạt động', value: activeUsers, color: '#43bf73' },
      { name: 'Bị khóa', value: users.length - activeUsers, color: '#fb777b' },
    ],
  }
}
