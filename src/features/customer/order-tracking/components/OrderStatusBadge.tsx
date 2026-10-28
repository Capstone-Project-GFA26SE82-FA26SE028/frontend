const labels: Record<string, string> = {
  PendingConfirmation: 'Waiting',
  Confirmed: 'Confirmed',
  Pending: 'Queued',
  Hold: 'On hold',
  Cooking: 'Cooking',
  Ready: 'Ready to serve',
  Served: 'Served',
  Cancelled: 'Cancelled',
}

export function OrderStatusBadge({ status }: { status: string }) {
  const color =
    status === 'Cancelled'
      ? 'bg-red-50 text-red-700'
      : ['PendingConfirmation', 'Pending', 'Hold'].includes(status)
        ? 'bg-amber-50 text-amber-800'
        : 'bg-mint text-brand'
  return (
    <span
      className={
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ' +
        color
      }
    >
      {labels[status] || status}
    </span>
  )
}
