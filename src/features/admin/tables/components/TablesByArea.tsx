import { TableCard } from './TableCard'
import { Icon } from '../../../../components/Icon/Icon'
import type { Table, TableMode } from '../types/types'
import type { Area } from '../../areas/types/types'
import type { Restaurant } from '../../restaurants/types/types'
export function TablesByArea({
  tables,
  areas,
  restaurants,
  onAction,
}: {
  tables: Table[]
  areas: Area[]
  restaurants: Restaurant[]
  onAction: (mode: TableMode, id: string) => void
}) {
  const groups = new Map<string, Map<string, Table[]>>()
  for (const table of tables) {
    const restaurantId =
      areas.find((area) => area.areaId === table.areaId)?.restaurantId || ''
    if (!groups.has(restaurantId)) groups.set(restaurantId, new Map())
    const restaurant = groups.get(restaurantId)!
    if (!restaurant.has(table.areaId)) restaurant.set(table.areaId, [])
    restaurant.get(table.areaId)!.push(table)
  }
  return (
    <div className="space-y-8">
      {[...groups].map(([restaurantId, areaGroups]) => (
        <section key={restaurantId} className="space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Icon name="store" size={21} />
            {restaurants.find((r) => r.restaurantId === restaurantId)
              ?.restaurantName || 'Chưa có thông tin nhà hàng'}
          </h2>
          {[...areaGroups].map(([areaId, items]) => {
            const area = areas.find((a) => a.areaId === areaId)
            return (
              <section
                key={areaId}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon name="grid" size={18} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-slate-800">
                      {area?.areaName || 'Chưa có thông tin khu vực'}
                    </h3>
                    {area && (
                      <p className="text-xs text-slate-500">{area.areaCode}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {items.map((table) => (
                    <TableCard
                      key={table.tableId}
                      table={table}
                      areaName={area?.areaName || 'Chưa có thông tin khu vực'}
                      onAction={onAction}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </section>
      ))}
    </div>
  )
}
