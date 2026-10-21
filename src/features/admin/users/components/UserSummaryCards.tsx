import { SummaryCards } from '../../components/AdminUI'

export function UserSummaryCards({
  totals,
  adminCount,
  hasError,
  onRetry,
}: {
  totals?: { all: number; active: number; locked: number }
  adminCount?: number
  hasError: boolean
  onRetry: () => void
}) {
  return (
    <>
      <SummaryCards
        items={[
          {
            label: 'Total users',
            value: totals?.all ?? '—',
            icon: 'users',
            note: 'All accounts',
          },
          {
            label: 'Active accounts',
            value: totals?.active ?? '—',
            icon: 'check',
            note: 'Enabled accounts',
          },
          {
            label: 'Inactive accounts',
            value: totals?.locked ?? '—',
            icon: 'shield',
            note: 'Account history retained',
          },
          {
            label: 'Administrators',
            value: adminCount ?? '—',
            icon: 'settings',
            note: 'Active administrators',
          },
        ]}
      />
      {hasError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"
        >
          Unable to load account statistics.{' '}
          <button className="underline" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </>
  )
}
