import type { KitchenNotification } from '../types/notification'
import { notificationTime } from '../utils/notification'

export function NotificationCard({
  item,
  selected,
  onSelect,
}: {
  item: KitchenNotification
  selected: boolean
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`w-full rounded-xl border p-4 text-left transition-colors hover:border-emerald-400 ${selected ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-slate-200'} ${item.readAt ? 'bg-white' : 'bg-emerald-50'}`}
      >
        <span className="flex items-start justify-between gap-3">
          <strong className="break-words text-sm">{item.title}</strong>
          {!item.readAt && (
            <span className="shrink-0 text-xs font-semibold text-emerald-700">
              Chưa đọc
            </span>
          )}
        </span>
        <span className="mt-2 block whitespace-pre-wrap break-words text-sm text-slate-600">
          {item.message}
        </span>
        <time
          dateTime={item.createdAt || undefined}
          className="mt-2 block text-xs text-slate-500"
        >
          {notificationTime(item.createdAt)}
        </time>
      </button>
    </li>
  )
}
