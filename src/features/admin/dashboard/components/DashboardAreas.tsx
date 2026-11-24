import { Icon } from '../../../../components/Icon/Icon'
import type { Area } from '../../areas/types/types'
import type { Table } from '../../tables/types/types'
import { DashboardSection } from './DashboardSection'
export function DashboardAreas({
  areas,
  tables,
}: {
  areas: Area[]
  tables: Table[]
}) {
  return (
    <DashboardSection title="Danh sách khu vực" icon="home" href="/admin/areas">
      <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
        {areas.slice(0, 4).map((area) => {
          const count = tables.filter((t) => t.areaId === area.areaId).length
          return (
            <div
              key={area.areaId}
              className="flex items-center gap-3 px-3 py-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-emerald-800">
                <Icon name="pin" size={17} />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
                {area.areaName}
                {!area.isActive && (
                  <span className="block text-xs font-normal text-slate-400">
                    Ngừng hoạt động
                  </span>
                )}
              </span>
              <span className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-700 tabular-nums">
                {count} bàn
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
