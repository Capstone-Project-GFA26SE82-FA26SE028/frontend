import { Icon } from '../../../../components/Icon/Icon'
import type { Area } from '../../areas/schema'
import type { RestaurantTable } from '../../tables/schema'
import { DashboardSection } from './DashboardSection'
export function DashboardAreas({
  areas,
  tables,
}: {
  areas: Area[]
  tables: RestaurantTable[]
}) {
  return (
    <DashboardSection title="Danh sách khu vực" icon="home" href="/admin/areas">
      <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
        {areas.slice(0, 4).map((area, i) => {
          const count = tables.filter((t) => t.areaId === area.id).length
          const percent = tables.length ? (count / tables.length) * 100 : 0
          return (
            <div key={area.id} className="flex items-center gap-3 px-3 py-3">
              <span
                className={
                  'flex size-9 shrink-0 items-center justify-center rounded-lg ' +
                  [
                    'bg-emerald-50 text-emerald-700',
                    'bg-blue-50 text-blue-600',
                    'bg-orange-50 text-orange-600',
                    'bg-lime-50 text-lime-600',
                  ][i % 4]
                }
              >
                <Icon
                  name={['home', 'store', 'crown', 'leaf'][i % 4]}
                  size={19}
                />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
                {area.name}
                {!area.active && (
                  <span className="block text-xs font-normal text-slate-400">
                    Ngừng hoạt động
                  </span>
                )}
              </span>
              <span className="shrink-0 text-sm text-slate-600">
                {count} bàn
              </span>
              <div className="hidden h-2 w-[28%] overflow-hidden rounded-full bg-slate-100 sm:block">
                <div
                  className="h-full rounded-full bg-emerald-400/80"
                  style={{ width: percent + '%' }}
                />
              </div>
              <span className="w-12 text-right text-xs tabular-nums text-slate-500">
                {percent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%
              </span>
            </div>
          )
        })}
        {!areas.length && (
          <p className="p-6 text-center text-sm text-slate-500">
            Chưa có khu vực được tạo.
          </p>
        )}
      </div>
    </DashboardSection>
  )
}
