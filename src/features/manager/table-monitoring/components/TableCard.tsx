import { Icon } from '../../../../components/Icon/Icon'
import type { Table } from '../types/table'
export function TableCard({
  table,
  areaName,
  onView,
}: {
  table: Table
  areaName: string
  onView: () => void
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={
          'flex items-start justify-between gap-3 bg-gradient-to-br p-4 text-white ' +
          (table.isActive
            ? 'from-brand-dark to-brand'
            : 'from-rose-900 to-rose-700')
        }
      >
        <button
          onClick={onView}
          aria-label={'Xem chi tiết ' + table.tableCode}
          className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <h3
            className="truncate text-2xl font-bold tracking-tight"
            title={table.tableCode}
          >
            {table.tableCode}
          </h3>
          <span className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-inset ring-white/15">
            {table.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <Icon name="pin" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400">Khu vực</p>
            <p
              className="mt-0.5 truncate text-sm font-semibold text-slate-700"
              title={areaName}
            >
              {areaName}
            </p>
          </div>
        </div>
        <div className="shrink-0 border-l border-slate-100 pl-3 text-right">
          <p className="text-[11px] text-slate-400">Số chỗ</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">
            {table.capacity}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 p-2">
        <button
          onClick={onView}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          <Icon name="eye" size={18} />
          Xem chi tiết
        </button>
      </div>
    </article>
  )
}
