import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
export function DashboardSection({
  title,
  icon,
  href,
  action = 'Xem tất cả',
  children,
}: {
  title: string
  icon: string
  href?: string
  action?: string
  children: ReactNode
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_2px_12px_#173b2c03] sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Icon name={icon} size={17} />
        </span>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {href && (
          <Link
            to={href}
            className="ml-auto flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900"
          >
            {action}
            <Icon name="arrow" size={15} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
