import { dateLabel } from '../../menu-management/utils/price'

export function StockRefresh({
  updatedAt,
  refreshing,
  refresh,
}: {
  updatedAt: number
  refreshing: boolean
  refresh: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs leading-5 text-slate-500">
        {updatedAt
          ? `Lần tải thành công gần nhất: ${dateLabel(new Date(updatedAt).toISOString())} (UTC+7). `
          : ''}
        Kiểm tra mỗi 30 giây khi trang đang mở. Đây là thời điểm tải dữ liệu,
        không phải thời điểm giao dịch kho gần nhất.
      </p>
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        disabled={refreshing}
        onClick={refresh}
      >
        {refreshing ? 'Đang làm mới…' : 'Làm mới'}
      </button>
    </div>
  )
}
