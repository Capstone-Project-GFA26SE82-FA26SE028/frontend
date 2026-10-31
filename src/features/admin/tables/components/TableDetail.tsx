import type { Table } from '../types/types'

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
          {table.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </p>
      </div>
      <dl className="divide-y divide-slate-100">
        {[
          ['Nhà hàng', restaurantName],
          ['Khu vực', areaName],
          ['Sức chứa', table.capacity + ' seats'],
          ['Trạng thái vệ sinh', table.cleaningStatus],
          ['Tọa độ X', table.positionX ?? 'Not set'],
          ['Tọa độ Y', table.positionY ?? 'Not set'],
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
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 justify-center"
          onClick={onClose}
        >
          Đóng
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40 justify-center"
          onClick={onEdit}
        >
          Sửa bàn
        </button>
      </div>
    </div>
  )
}
