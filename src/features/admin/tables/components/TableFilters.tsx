import type { Area } from '../../areas/types/types'
import type { Restaurant } from '../../restaurants/types/types'
export function TableFilters({
  search,
  restaurantId,
  areaId,
  status,
  restaurants,
  areas,
  onSearch,
  onRestaurant,
  onArea,
  onStatus,
  onReset,
}: {
  search: string
  restaurantId: string
  areaId: string
  status: string
  restaurants: Restaurant[]
  areas: Area[]
  onSearch: (v: string) => void
  onRestaurant: (v: string) => void
  onArea: (v: string) => void
  onStatus: (v: string) => void
  onReset: () => void
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex gap-1" role="group" aria-label="Trạng thái bàn">
        {[
          ['', 'Tất cả'],
          ['true', 'Đang hoạt động'],
          ['false', 'Ngừng hoạt động'],
        ].map(([v, label]) => (
          <button
            key={v}
            aria-pressed={status === v}
            onClick={() => onStatus(v)}
            className={
              'rounded-full border px-4 py-2 text-sm font-semibold ' +
              (status === v
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 text-slate-500')
            }
          >
            {label}
          </button>
        ))}
      </div>
      <input
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 min-w-0 sm:ml-auto sm:!w-52"
        aria-label="Tìm bàn"
        placeholder="Tìm mã bàn…"
        maxLength={255}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        aria-label="Lọc theo nhà hàng"
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:!w-48"
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
      <select
        aria-label="Lọc theo khu vực"
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:!w-44"
        value={areaId}
        onChange={(e) => onArea(e.target.value)}
      >
        <option value="">Tất cả khu vực</option>
        {areas
          .filter((a) => !restaurantId || a.restaurantId === restaurantId)
          .map((a) => (
            <option key={a.areaId} value={a.areaId}>
              {a.areaName}
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
