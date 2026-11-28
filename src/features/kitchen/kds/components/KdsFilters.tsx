import { Icon } from '../../../../components/Icon/Icon'
import { kdsColumns } from '../constants'
import type { Ticket, Status, KdsOrder } from '../types'

type Props = {
  query: string
  setQuery: (value: string) => void
  filter: string
  setFilter: (value: string) => void
  sort: string
  setSort: (value: string) => void
  active: Ticket[]
  activeColumn?: 'all' | Status
  setActiveColumn?: (col: 'all' | Status) => void
  orders?: KdsOrder[]
}

export function KdsFilters({
  query,
  setQuery,
  filter,
  setFilter,
  sort,
  setSort,
  active,
  activeColumn = 'all',
  setActiveColumn,
  orders = [],
}: Props) {
  const totalOrders = orders.length || new Set(active.map((t) => t.order)).size

  const handleSelectColumn = (col: 'all' | Status) => {
    setActiveColumn?.(col)
    if (col !== 'all') {
      const el = document.getElementById(`kds-column-${col}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  return (
    <div className="mb-3.5 space-y-2.5">
      {/* 1. THANH ĐIỀU HƯỚNG CHO CÁC Ô (Cực kỳ tiện khi toàn màn hình / cố định màn hình) */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xs"
        role="tablist"
        aria-label="Thanh điều hướng các ô trạng thái bếp"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeColumn === 'all'}
          onClick={() => handleSelectColumn('all')}
          className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
            activeColumn === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Icon name="grid" size={14} />
          <span>Tất cả các ô</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
              activeColumn === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {totalOrders}
          </span>
        </button>

        {kdsColumns.map((c) => {
          const count = orders.filter((o) => o.status === c.status).length
          const isSelected = activeColumn === c.status
          const toneBadge = {
            waiting: isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-900',
            cooking: isSelected ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-900',
            ready: isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-900',
            hold: isSelected ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-900',
          }[c.tone]

          const activeBorder = {
            waiting: 'ring-2 ring-amber-500 bg-amber-50/70 text-amber-950',
            cooking: 'ring-2 ring-sky-500 bg-sky-50/70 text-sky-950',
            ready: 'ring-2 ring-emerald-500 bg-emerald-50/70 text-emerald-950',
            hold: 'ring-2 ring-violet-500 bg-violet-50/70 text-violet-950',
          }[c.tone]

          return (
            <button
              key={c.status}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelectColumn(c.status)}
              className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                isSelected
                  ? `${activeBorder} shadow-xs font-black`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon name={c.icon} size={14} />
              <span>{c.title}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${toneBadge}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 2. BỘ LỌC ĐƠN, TÌM KIẾM VÀ SẮP XẾP */}
      <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
        {/* Tabs Lọc Đơn Hàng VIP / Chờ lâu */}
        <div
          className="flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 text-xs font-semibold"
          role="group"
          aria-label="Lọc đơn bếp"
        >
          {[
            { key: 'All', label: 'Tất cả đơn' },
            { key: 'VIP priority', label: 'Ưu tiên VIP', icon: 'crown' as const },
            { key: 'Long wait', label: 'Chờ lâu (>10p)', icon: 'clock' as const },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              className={`flex min-h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                filter === f.key
                  ? 'bg-white font-bold text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.icon && <Icon name={f.icon} size={13} />}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Tìm kiếm và Sắp xếp */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60 sm:flex-initial">
            <Icon
              name="search"
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-label="Tìm trong màn hình bếp"
              placeholder="Tìm mã đơn, số bàn, tên món…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/90 bg-white py-1.5 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            {query && (
              <button
                type="button"
                aria-label="Xóa tìm kiếm"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={13} />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <select
            aria-label="Sắp xếp đơn bếp"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200/90 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="By arrival time">Theo thời gian nhận</option>
            <option value="VIP first">Ưu tiên bàn VIP trước</option>
          </select>
        </div>
      </div>
    </div>
  )
}
