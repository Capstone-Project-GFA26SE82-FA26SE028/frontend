import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
export function DashboardStats({
  users,
  active,
  newUsers,
  tables,
  areas,
}: {
  users: number
  active: number
  newUsers: number
  tables: number
  areas: number
}) {
  const items = [
    {
      label: 'Tổng tài khoản',
      value: users,
      note: newUsers + ' mới trong tháng',
      icon: 'users',
      tone: 'bg-emerald-100/70 text-emerald-700',
      href: 'users',
    },
    {
      label: 'Đang hoạt động',
      value: active,
      note:
        (users ? (active / users) * 100 : 0).toLocaleString('vi-VN', {
          maximumFractionDigits: 1,
        }) + '% tổng tài khoản',
      icon: 'shield',
      tone: 'bg-sky-100 text-emerald-700',
      href: 'users',
    },
    {
      label: 'Tổng số bàn',
      value: tables,
      note: areas + ' khu vực',
      icon: 'utensils',
      tone: 'bg-orange-100 text-orange-600',
      href: 'tables',
    },
    {
      label: 'Khu vực',
      value: areas,
      note: 'Đã cấu hình',
      icon: 'grid',
      tone: 'bg-violet-100 text-violet-600',
      href: 'areas',
    },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <Link
          key={item.label}
          to={'/admin/' + item.href}
          className="group flex min-w-0 flex-col items-start gap-3 sm:flex-row rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_2px_12px_#173b2c03] transition hover:border-emerald-200 hover:shadow-sm sm:p-5"
        >
          <span
            className={
              'flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-14 ' +
              item.tone
            }
          >
            <Icon name={item.icon} size={25} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="mt-1 text-2xl font-bold leading-none tracking-tight text-slate-900">
              {item.value}
            </p>
            <p
              className={
                'mt-2 text-xs leading-5 ' +
                (i === 0 ? 'text-emerald-600' : 'text-slate-500')
              }
            >
              {i === 0 ? '↑ ' : ''}
              {item.note}
            </p>
          </div>
          <Icon
            name="chevron"
            size={14}
            className="ml-auto hidden text-slate-400 sm:block"
          />
        </Link>
      ))}
    </div>
  )
}
