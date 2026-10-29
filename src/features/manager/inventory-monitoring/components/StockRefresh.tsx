import { secondaryButton } from '../../../admin/components/AdminUI'
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
        className={secondaryButton}
        disabled={refreshing}
        onClick={refresh}
      >
        {refreshing ? 'Đang làm mới…' : 'Làm mới'}
      </button>
    </div>
  )
}
