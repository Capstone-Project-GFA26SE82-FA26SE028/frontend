const labels: Record<string, string> = {
  PendingConfirmation: 'Đang đợi',
  Confirmed: 'Đã xác nhận',
  Pending: 'Chờ chế biến',
  Hold: 'Tạm hoãn',
  Cooking: 'Đang nấu',
  Ready: 'Món đã xong',
  Served: 'Đã phục vụ',
  Cancelled: 'Đã hủy',
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
