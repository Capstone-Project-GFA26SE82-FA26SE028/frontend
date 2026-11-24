import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
export function DashboardStats({
  users,
  active,
  tables,
  areas,
}: {
  users: number | null
  active: number | null
  tables: number | null
  areas: number | null
}) {
  const items = [
    {
      label: 'Tổng tài khoản',
      value: users,
      note: '',
      icon: 'users',
      tone: 'bg-emerald-100/70 text-emerald-700',
      href: 'users',
    },
    {
      label: 'Đang hoạt động',
      value: active,
      note:
        users === null || active === null
          ? ''
          : (users ? (active / users) * 100 : 0).toLocaleString('vi-VN', {
              maximumFractionDigits: 1,
            }) + '% tổng tài khoản',
      icon: 'shield',
      tone: 'bg-sky-100 text-sky-700',
      href: 'users',
    },
    {
      label: 'Tổng số bàn',
      value: tables,
      note: areas === null ? '' : areas + ' khu vực',
      icon: 'table',
      tone: 'bg-orange-100 text-orange-600',
      href: 'tables',
    },
    {
      label: 'Khu vực',
      value: areas,
      note: '',
      icon: 'grid',
      tone: 'bg-violet-100 text-violet-600',
      href: 'areas',
    },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.label}
          to={'/admin/' + item.href}
          className="group min-w-0 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-colors hover:border-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-600 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              className={
                'flex size-10 shrink-0 items-center justify-center rounded-xl ' +
                item.tone
              }
            >
              <Icon name={item.icon} size={21} />
            </span>
            <Icon
              name="arrow"
              size={16}
              className="text-slate-400 transition-colors group-hover:text-emerald-700"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="mt-1.5 text-3xl font-bold leading-none tracking-tight text-slate-900 tabular-nums">
              {item.value ?? '—'}
            </p>
            {item.note && (
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                {item.note}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
