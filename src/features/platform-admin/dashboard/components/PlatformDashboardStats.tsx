import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import type { usePlatformDashboard } from '../hooks/usePlatformDashboard'

export function PlatformDashboardStats({
  users,
  restaurants,
  activeSessions,
}: Pick<
  ReturnType<typeof usePlatformDashboard>,
  'users' | 'restaurants' | 'activeSessions'
>) {
  const stats = [
    {
      title: 'Nhà hàng',
      value: restaurants.data?.totalCount,
      query: restaurants,
      icon: 'store',
      tone: 'bg-orange-100 text-orange-700',
      to: 'restaurants',
    },
    {
      title: 'Tổng tài khoản',
      value: users.data?.all,
      query: users,
      icon: 'users',
      tone: 'bg-emerald-100/70 text-emerald-700',
      to: 'users',
    },
    {
      title: 'Tài khoản hoạt động',
      value: users.data?.active,
      query: users,
      icon: 'shield',
      tone: 'bg-sky-100 text-sky-700',
      to: 'users',
    },
    {
      title: 'Phiên đang hoạt động',
      value: activeSessions.data?.totalCount,
      query: activeSessions,
      icon: 'monitor',
      tone: 'bg-violet-100 text-violet-700',
      to: 'sessions',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map(({ title, value, query, icon, tone, to }) => (
        <section
          key={title}
          className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200 sm:p-5"
        >
          <Link
            to={to}
            className="group block rounded-md focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span
                className={`grid size-10 place-items-center rounded-xl ${tone}`}
              >
                <Icon name={icon} size={20} />
              </span>
              <Icon
                name="arrow"
                size={16}
                className="text-slate-400 group-hover:text-emerald-700"
              />
            </div>
            <h2 className="text-sm font-medium text-slate-600">{title}</h2>
            <p className="mt-1 text-3xl leading-none font-bold tracking-tight text-emerald-950 tabular-nums">
              {value?.toLocaleString('vi-VN') ?? '—'}
            </p>
          </Link>
          {query.isError ? (
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="mt-2 text-xs font-medium text-rose-700 underline"
            >
              Tải thất bại. Thử lại
            </button>
          ) : (
            query.isPending && (
              <p role="status" className="mt-2 text-xs text-slate-500">
                Đang tải…
              </p>
            )
          )}
        </section>
      ))}
    </div>
  )
}
