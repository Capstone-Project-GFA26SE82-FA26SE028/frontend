import { secondaryButton } from '../../../admin/components/AdminUI'
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
        Sample preview · Refresh regenerates the example data.
        {updatedAt > 0 &&
          ` Preview generated: ${dateLabel(new Date(updatedAt).toISOString())} (UTC+7).`}
      </p>
      <button
        className={secondaryButton}
        onClick={refresh}
        disabled={refreshing}
      >
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>
  )
}
