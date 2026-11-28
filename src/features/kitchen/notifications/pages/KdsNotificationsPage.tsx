import {
  notificationButtonClass as button,
  notificationTypes,
  NOTIFICATION_PAGE_SIZE,
} from '../constants/notification'
import type { useKdsNotifications } from '../hooks/useKdsNotifications'
import { notificationError, notificationTime } from '../utils/notification'
import { NotificationCard } from '../components/NotificationCard'

export function KdsNotificationsPage({
  model: m,
}: {
  model: ReturnType<typeof useKdsNotifications>
}) {
  const totalPages = Math.max(
    1,
    Math.ceil((m.list.data?.totalCount || 0) / NOTIFICATION_PAGE_SIZE),
  )
  const item = m.detail.data?.notification
  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Loại thông báo"
          className="min-h-11 rounded-xl border p-2 text-sm"
          value={m.type}
          onChange={(e) => m.filterType(e.target.value)}
        >
          {notificationTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={m.unreadOnly}
            onChange={(e) => m.filterUnread(e.target.checked)}
          />
          Chưa đọc
        </label>
        <button
          type="button"
          className={button}
          onClick={m.refresh}
        >
          {m.list.isFetching ? 'Đang tải…' : 'Làm mới'}
        </button>
        <button
          type="button"
          className={button}
          disabled={m.markRead.isPending || !m.unread.data?.count}
          onClick={() => m.markRead.mutate(undefined)}
        >
          Đọc tất cả
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Thông báo dành cho tài khoản của bạn. Tự cập nhật mỗi 5 giây. “Đọc tất
        cả” áp dụng cho mọi thông báo, kể cả ngoài bộ lọc.
      </p>
      {m.list.isPending && (
        <div className="flex items-center gap-3 py-6 text-sm text-slate-500">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Đang tải thông báo…</span>
        </div>
      )}
      {m.list.isError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p className="font-medium">{notificationError(m.list.error)}</p>
          <button
            type="button"
            className="mt-2 inline-flex items-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
            onClick={() => void m.list.refetch()}
          >
            Thử lại ngay
          </button>
        </div>
      )}
      {m.markRead.isError && (
        <p role="alert" className="text-sm text-rose-700">
          {notificationError(m.markRead.error)}
        </p>
      )}
      {m.markRead.isSuccess && (
        <p role="status" className="text-sm text-emerald-700">
          Đã cập nhật trạng thái đọc.
        </p>
      )}
      {m.selectedId && (
        <section
          aria-label="Chi tiết thông báo"
          className="space-y-2 rounded-xl border border-emerald-200 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Chi tiết thông báo</h3>
            <button
              type="button"
              className={button}
              onClick={() => m.select('')}
            >
              Đóng chi tiết
            </button>
          </div>
          {m.detail.isPending && <p role="status">Đang tải chi tiết…</p>}
          {m.detail.isError && (
            <div role="alert">
              <p>{notificationError(m.detail.error)}</p>
              <button
                type="button"
                className={button}
                onClick={() => void m.detail.refetch()}
              >
                Thử lại
              </button>
            </div>
          )}
          {item && (
            <>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="whitespace-pre-wrap break-words text-sm">
                {item.message}
              </p>
              <p className="text-xs text-slate-500">
                {notificationTime(item.createdAt)}
              </p>
              <button
                type="button"
                className={button}
                disabled={!!item.readAt || m.markRead.isPending}
                onClick={() => m.markRead.mutate(item.id)}
              >
                {item.readAt ? 'Đã đọc' : 'Đánh dấu đã đọc'}
              </button>
            </>
          )}
        </section>
      )}
      {m.list.isSuccess && !m.list.data.items.length && (
        <p className="py-6 text-center text-sm text-slate-500">
          Không có thông báo phù hợp.
        </p>
      )}
      <ul className="space-y-3">
        {m.list.data?.items.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            selected={m.selectedId === item.id}
            onSelect={() => m.select(item.id)}
          />
        ))}
      </ul>
      <nav
        aria-label="Phân trang thông báo"
        className="flex items-center justify-between gap-3"
      >
        <button
          type="button"
          className={button}
          disabled={m.page <= 1 || m.list.isFetching}
          onClick={() => m.setPage(m.page - 1)}
        >
          Trang trước
        </button>
        <span className="text-sm">
          Trang {m.page} / {totalPages}
        </span>
        <button
          type="button"
          className={button}
          disabled={!m.list.data || m.page >= totalPages || m.list.isFetching}
          onClick={() => m.setPage(m.page + 1)}
        >
          Trang sau
        </button>
      </nav>
    </div>
  )
}
