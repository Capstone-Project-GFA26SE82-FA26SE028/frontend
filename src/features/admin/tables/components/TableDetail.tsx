import type { Table } from '../types'
import { primaryButton, secondaryButton } from '../../components/AdminUI'
export function TableDetail({
  table,
  areaName,
  restaurantName,
  onEdit,
  onClose,
}: {
  table: Table
  areaName: string
  restaurantName: string
  onEdit: () => void
  onClose: () => void
}) {
  return (
    <div className="space-y-5 p-6">
      <div className="rounded-2xl bg-emerald-50 p-5">
        <h3 className="break-words text-xl font-bold">{table.tableCode}</h3>
        <p className="mt-2 text-sm text-emerald-700">
          {table.isActive ? 'Active' : 'Inactive'}
        </p>
      </div>
      <dl className="divide-y divide-slate-100">
        {[
          ['Restaurant', restaurantName],
          ['Area', areaName],
          ['Capacity', table.capacity + ' seats'],
          ['Cleaning status', table.cleaningStatus],
          ['Position X', table.positionX ?? 'Not set'],
          ['Position Y', table.positionY ?? 'Not set'],
        ].map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 text-sm"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="break-words text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-2 gap-3">
        <button
          className={secondaryButton + ' justify-center'}
          onClick={onClose}
        >
          Close
        </button>
        <button className={primaryButton + ' justify-center'} onClick={onEdit}>
          Edit table
        </button>
      </div>
    </div>
  )
}
