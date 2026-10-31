import { dateLabel } from '../../menu-management/utils/price'

export function OperationsRefresh({
  updatedAt,
  refreshing,
  refresh,
}: {
  updatedAt: number
  refreshing: boolean
  refresh: () => void
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs leading-5 text-slate-500">
        Dữ liệu mẫu · Làm mới sẽ tạo lại dữ liệu minh họa.
        {updatedAt > 0 &&
          ` Dữ liệu mẫu được tạo lúc: ${dateLabel(new Date(updatedAt).toISOString())} (UTC+7).`}
      </p>
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        onClick={refresh}
        disabled={refreshing}
      >
        {refreshing ? 'Đang làm mới…' : 'Làm mới'}
      </button>
    </div>
  )
}
