import { Icon } from '../../../../components/Icon/Icon'
import type { usePlatformDashboard } from '../hooks/usePlatformDashboard'

export function PlatformAccountStatus({
  users,
}: Pick<ReturnType<typeof usePlatformDashboard>, 'users'>) {
  const activeShare = users.data?.all
    ? Math.min(100, (users.data.active / users.data.all) * 100)
    : 0

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="flex items-center gap-2 font-semibold text-slate-800">
        <Icon name="users" size={19} className="text-emerald-700" />
        Trạng thái tài khoản
      </h2>
      {users.data ? (
        <div className="mt-5 flex flex-col items-center gap-4 min-[480px]:flex-row sm:gap-6">
          <div
            className="grid size-40 shrink-0 place-items-center rounded-full"
            style={{
              background: users.data.all
                ? `conic-gradient(#16805d ${activeShare}%, #d58a94 0)`
                : '#e2e8f0',
            }}
          >
            <div className="grid size-29 content-center rounded-full bg-white text-center">
              <strong className="text-2xl font-bold text-slate-800 tabular-nums">
                {users.data.all.toLocaleString('vi-VN')}
              </strong>
              <span className="text-xs text-slate-500">Tổng tài khoản</span>
            </div>
          </div>
          <dl className="w-full min-w-0 flex-1 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <dt className="flex items-center gap-2 text-slate-600">
                <span className="size-2.5 shrink-0 rounded-full bg-[#16805d]" />
                Đang hoạt động
              </dt>
              <dd className="font-semibold text-emerald-800 tabular-nums">
                {users.data.active.toLocaleString('vi-VN')}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <dt className="flex items-center gap-2 text-slate-600">
                <span className="size-2.5 shrink-0 rounded-full bg-[#d58a94]" />
                Đã vô hiệu hóa
              </dt>
              <dd className="font-semibold text-slate-800 tabular-nums">
                {users.data.locked.toLocaleString('vi-VN')}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          {users.isError
            ? 'Không tải được số liệu tài khoản.'
            : 'Đang tải số liệu…'}
        </p>
      )}
    </section>
  )
}
