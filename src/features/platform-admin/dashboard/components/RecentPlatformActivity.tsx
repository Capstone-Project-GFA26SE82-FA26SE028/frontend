import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import type { usePlatformDashboard } from '../hooks/usePlatformDashboard'

export function RecentPlatformActivity({
  activity,
}: Pick<ReturnType<typeof usePlatformDashboard>, 'activity'>) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-4 sm:px-5">
        <h2 className="flex items-center gap-2 font-semibold text-slate-800">
          <Icon name="clipboard" size={19} className="text-emerald-700" />
          Hoạt động gần đây
        </h2>
        <Link
          to="activity"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
        >
          Xem nhật ký <Icon name="arrow" size={15} />
        </Link>
      </div>
      {activity.isError ? (
        <div className="p-5 text-sm">
          <p role="alert" className="text-rose-700">
            Không tải được nhật ký hoạt động.
          </p>
          <button
            type="button"
            onClick={() => void activity.refetch()}
            className="mt-2 text-emerald-700 underline"
          >
            Thử lại
          </button>
        </div>
      ) : activity.isPending ? (
        <p role="status" className="p-5 text-sm text-slate-500">
          Đang tải nhật ký…
        </p>
      ) : activity.data.items.length === 0 ? (
        <p className="p-5 text-sm text-slate-500">
          Chưa có hoạt động được ghi nhận.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 px-4 sm:px-5">
          {activity.data.items.map((item) => (
            <li
              key={item.auditLogId}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5 text-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon name="activity" size={16} />
                </span>
                <div className="min-w-0">
                  <p className="break-words font-medium text-slate-800">
                    {item.fullName ||
                      item.userName ||
                      item.email ||
                      'Chưa rõ người thực hiện'}
                  </p>
                  <p className="mt-0.5 break-words text-xs text-slate-500">
                    {item.action || 'Chưa rõ thao tác'}
                  </p>
                </div>
              </div>
              <time
                dateTime={item.createdAt}
                className="text-xs text-slate-500 tabular-nums"
              >
                {new Date(item.createdAt).toLocaleString('vi-VN', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
