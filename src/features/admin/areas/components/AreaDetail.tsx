import type { Area } from '../types'
import { primaryButton, secondaryButton } from '../../components/AdminUI'
export function AreaDetail({
  area,
  restaurantName,
  onEdit,
  onClose,
}: {
  area: Area
  restaurantName: string
  onEdit: () => void
  onClose: () => void
}) {
  return (
    <div className="space-y-5 p-6">
      <div className="rounded-2xl bg-emerald-50 p-5">
        <h3 className="text-xl font-semibold">{area.areaName}</h3>
        <p className="mt-1 text-sm text-emerald-700">
          {area.areaCode} ? {area.isActive ? 'Active' : 'Inactive'}
        </p>
      </div>
      <dl className="divide-y divide-slate-100">
        {[
          ['Restaurant', restaurantName],
          ['Service type', area.serviceType],
          ['Space type', area.spaceType],
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
      <div className="flex justify-end gap-3">
        <button className={secondaryButton} onClick={onClose}>
          Close
        </button>
        <button className={primaryButton} onClick={onEdit}>
          Edit area
        </button>
      </div>
    </div>
  )
}
