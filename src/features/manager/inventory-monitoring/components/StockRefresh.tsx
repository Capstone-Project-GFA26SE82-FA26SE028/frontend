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
          ? `Last successful fetch: ${dateLabel(new Date(updatedAt).toISOString())} (UTC+7). `
          : ''}
        Checks every 30 seconds while this page is open. This is the fetch time,
        not the time of the last stock transaction.
      </p>
      <button
        className={secondaryButton}
        disabled={refreshing}
        onClick={refresh}
      >
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>
  )
}
