import { Icon } from '../../../../components/Icon/Icon'
import { TableCard } from './TableCard'
import type { Area, Table } from '../types/table'
export function TablesByArea({ tables, areas, onView }: { tables: Table[]; areas: Area[]; onView: (id: string) => void }) {
  const groups = new Map<string, Table[]>()
  for (const table of tables) groups.set(table.areaId, [...(groups.get(table.areaId) || []), table])
  return <div className="space-y-8">{[...groups].map(([areaId, items]) => {
    const area = areas.find(value => value.areaId === areaId)
    const name = area?.areaName || 'Chưa có thông tin khu vực'
    return <section key={areaId} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Icon name="grid" size={18} /></span><div className="min-w-0"><h3 className="break-words font-semibold text-slate-800">{name}</h3>{area && <p className="text-xs text-slate-500">{area.areaCode}</p>}</div></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{items.map(table => <TableCard key={table.tableId} table={table} areaName={name} onView={() => onView(table.tableId)} />)}</div>
    </section>
  })}</div>
}
