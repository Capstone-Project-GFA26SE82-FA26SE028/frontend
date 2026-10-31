import type { Restaurant } from '../../restaurants/types/types'
export function AreaFilters({
  search,
  onSearch,
  status,
  onStatus,
  restaurantId,
  onRestaurant,
  restaurants,
  onReset,
}: {
  search: string
  onSearch: (v: string) => void
  status: string
  onStatus: (v: string) => void
  restaurantId: string
  onRestaurant: (v: string) => void
  restaurants: Restaurant[]
  onReset: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <div className="flex gap-1" role="group" aria-label="Trạng thái khu vực">
        {[
          ['', 'Tất cả'],
          ['true', 'Đang hoạt động'],
          ['false', 'Ngừng hoạt động'],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => onStatus(value)}
            aria-pressed={status === value}
            className={
              'rounded-full border px-4 py-2 text-sm font-semibold ' +
              (status === value
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50')
            }
          >
            {label}
          </button>
        ))}
      </div>
      <input
        aria-label="Tìm khu vực"
        maxLength={255}
        placeholder="Tìm mã hoặc tên khu vực…"
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 min-w-0 sm:ml-auto sm:!w-64 sm:flex-none"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        aria-label="Lọc theo nhà hàng"
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:!w-56"
        value={restaurantId}
        onChange={(e) => onRestaurant(e.target.value)}
      >
        <option value="">Tất cả nhà hàng</option>
        {restaurants.map((r) => (
          <option key={r.restaurantId} value={r.restaurantId}>
            {r.restaurantName}
          </option>
        ))}
      </select>
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        onClick={onReset}
      >
        Đặt lại
      </button>
    </div>
  )
}
