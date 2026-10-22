import { fieldClass, secondaryButton } from '../../components/AdminUI'
import type { Restaurant } from '../../restaurants/types'
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
      <div className="flex gap-1" role="group" aria-label="Area status">
        {[
          ['', 'All'],
          ['true', 'Active'],
          ['false', 'Inactive'],
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
        aria-label="Search areas"
        maxLength={255}
        placeholder="Search code or name..."
        className={fieldClass + ' min-w-0 sm:ml-auto sm:!w-64 sm:flex-none'}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        aria-label="Filter by restaurant"
        className={fieldClass + ' sm:!w-56'}
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
      <button className={secondaryButton} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
