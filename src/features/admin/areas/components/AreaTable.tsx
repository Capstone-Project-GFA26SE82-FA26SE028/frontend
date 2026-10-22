import { Icon } from '../../../../components/Icon/Icon'
import { EmptyState } from '../../components/AdminUI'
import type { Area } from '../types'
import type { Restaurant } from '../../restaurants/types'
export function AreaTable({
  items,
  restaurants,
  onAction,
}: {
  items: Area[]
  restaurants: Restaurant[]
  onAction: (mode: 'view' | 'edit' | 'status' | 'delete', id: string) => void
}) {
  if (!items.length)
    return (
      <EmptyState
        title="No areas found"
        description="Change your filters or add an area."
      />
    )
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left text-sm">
        <thead className="border-y border-slate-100 bg-slate-50 text-slate-500">
          <tr>
            {[
              'Area',
              'Restaurant',
              'Service type',
              'Space type',
              'Status',
              'Actions',
            ].map((label) => (
              <th key={label} className="px-4 py-3.5 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((area) => (
            <tr
              key={area.areaId}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
            >
              <td className="max-w-56 break-words p-4">
                <p className="font-semibold">{area.areaName}</p>
                <p className="mt-1 text-xs text-slate-500">{area.areaCode}</p>
              </td>
              <td className="max-w-56 break-words p-4">
                {restaurants.find((r) => r.restaurantId === area.restaurantId)
                  ?.restaurantName || 'Restaurant unavailable'}
              </td>
              <td className="max-w-40 break-words p-4">{area.serviceType}</td>
              <td className="max-w-40 break-words p-4">{area.spaceType}</td>
              <td className="p-4">
                <span
                  className={
                    'whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ' +
                    (area.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500')
                  }
                >
                  {area.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex">
                  {(['view', 'edit', 'status', 'delete'] as const).map(
                    (mode) => {
                      const label =
                        mode === 'status'
                          ? area.isActive
                            ? 'Deactivate'
                            : 'Activate'
                          : mode === 'view'
                            ? 'View details'
                            : mode === 'edit'
                              ? 'Edit'
                              : 'Delete'
                      return (
                        <button
                          key={mode}
                          title={label}
                          aria-label={label + ' ' + area.areaName}
                          onClick={() => onAction(mode, area.areaId)}
                          className={
                            'flex size-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 ' +
                            (mode === 'delete' ||
                            (mode === 'status' && area.isActive)
                              ? 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
                              : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-700')
                          }
                        >
                          <Icon
                            name={
                              mode === 'view'
                                ? 'eye'
                                : mode === 'edit'
                                  ? 'edit'
                                  : mode === 'delete'
                                    ? 'trash'
                                    : area.isActive
                                      ? 'ban'
                                      : 'check'
                            }
                            size={18}
                          />
                        </button>
                      )
                    },
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
