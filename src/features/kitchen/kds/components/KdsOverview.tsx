import { Icon } from '../../../../components/Icon/Icon'
import { kdsColumns } from '../constants'
import type { Ticket, KdsOrder, Status } from '../types'

export function KdsOverview({
  area,
  orders,
  active,
  late,
  activeColumn = 'all',
  onSelectColumn,
}: {
  area: string
  orders: KdsOrder[]
  active: Ticket[]
  late: (ticket: Ticket) => boolean
  activeColumn?: 'all' | Status
  onSelectColumn?: (status: Status) => void
}) {
  const lateCount = active.filter(late).length

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Thông tin trạm bếp hiện tại */}
      <div className="flex items-center gap-3.5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon name={area === 'Bar' ? 'cup' : 'fire'} size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trạm bếp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đang hoạt động
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {area}
          </h2>
        </div>
      </div>

      {/* 4 bộ đếm trạng thái tiện gọn - Bấm để điều hướng nhanh đến ô */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {kdsColumns.map((c) => {
          const count = orders.filter((t) => t.status === c.status).length
          const isCurrent = activeColumn === c.status
          const toneStyles = {
            waiting: 'bg-amber-50/70 border-amber-200/70 text-amber-900',
            cooking: 'bg-sky-50/70 border-sky-200/70 text-sky-900',
            ready: 'bg-emerald-50/70 border-emerald-200/70 text-emerald-900',
            hold: 'bg-violet-50/70 border-violet-200/70 text-violet-900',
          }[c.tone]

          const countColors = {
            waiting: 'text-amber-700',
            cooking: 'text-sky-700',
            ready: 'text-emerald-700',
            hold: 'text-violet-700',
          }[c.tone]

          return (
            <button
              key={c.status}
              type="button"
              onClick={() => onSelectColumn?.(c.status)}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all active:scale-95 ${
                isCurrent ? 'ring-2 ring-slate-800 shadow-sm' : 'hover:shadow-xs'
              } ${toneStyles}`}
              title={`Bấm để điều hướng đến ô ${c.title}`}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-xs">
                <Icon name={c.icon} size={18} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold leading-none tabular-nums ${countColors}`}>
                  {String(count).padStart(2, '0')}
                </div>
                <div className="mt-0.5 text-xs font-semibold opacity-75">
                  {c.title}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Chỉ báo trạng thái đơn chờ lâu / ổn định */}
      <div className="flex items-center">
        {lateCount > 0 ? (
          <div className="flex w-full items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-rose-800 shadow-xs sm:w-auto">
            <Icon name="clock" size={20} className="text-rose-600 animate-bounce" />
            <div>
              <p className="text-xs font-bold">{lateCount} món chờ lâu (&gt;10p)</p>
              <p className="text-[11px] text-rose-600">Ưu tiên xử lý ngay</p>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2 text-emerald-800 sm:w-auto">
            <Icon name="check" size={20} className="text-emerald-600" />
            <div>
              <p className="text-xs font-bold">Hàng chờ ổn định</p>
              <p className="text-[11px] text-emerald-600">Không có món trễ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
