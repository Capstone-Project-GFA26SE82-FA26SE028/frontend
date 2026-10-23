import { fieldClass, secondaryButton } from '../../components/AdminUI'
import type { Area } from '../../areas/types'
import type { Restaurant } from '../../restaurants/types'
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
      <div className="flex gap-1" role="group" aria-label="Table status">
        {[
          ['', 'All'],
          ['true', 'Active'],
          ['false', 'Inactive'],
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
        className={fieldClass + ' min-w-0 sm:ml-auto sm:!w-52'}
        aria-label="Search tables"
        placeholder="Search table code..."
        maxLength={255}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        aria-label="Filter by restaurant"
        className={fieldClass + ' sm:!w-48'}
        value={restaurantId}
        onChange={(e) => onRestaurant(e.target.value)}
      >
        <option value="">All restaurants</option>
        {restaurants.map((r) => (
          <option key={r.restaurantId} value={r.restaurantId}>
            {r.restaurantName}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by area"
        className={fieldClass + ' sm:!w-44'}
        value={areaId}
        onChange={(e) => onArea(e.target.value)}
      >
        <option value="">All areas</option>
        {areas
          .filter((a) => !restaurantId || a.restaurantId === restaurantId)
          .map((a) => (
            <option key={a.areaId} value={a.areaId}>
              {a.areaName}
            </option>
          ))}
      </select>
      <button className={secondaryButton} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
