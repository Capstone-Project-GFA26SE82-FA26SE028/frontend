export const NOTIFICATION_PAGE_SIZE = 20
export const NOTIFICATION_POLL_MS = 5000
export const notificationTypes = [
  { value: '', label: 'Tất cả loại' },
  { value: 'KitchenOrderAccepted', label: 'Món mới chuyển bếp' },
  { value: 'Announcement', label: 'Thông báo nội bộ' },
] as const
export const notificationButtonClass =
  'min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-40'
