import type { Table } from '../types/table'
export function TableDetail({
  table,
  areaName,
  onClose,
}: {
  table: Table
  areaName: string
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
          ['Khu vực', areaName],
          ['Sức chứa', table.capacity + ' chỗ'],
          ['Trạng thái vệ sinh', table.cleaningStatus],
          ['Tọa độ X', table.positionX ?? 'Chưa thiết lập'],
          ['Tọa độ Y', table.positionY ?? 'Chưa thiết lập'],
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
      <button
        onClick={onClose}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Đóng
      </button>
    </div>
  )
}
