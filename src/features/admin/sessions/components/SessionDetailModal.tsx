import { Modal } from '../../../../components/Modal/Modal'
import { secondaryButton } from '../../components/AdminUI'
import { Badge } from '../../../../components/Badge/Badge'
import {
  sessionStatus,
  type LoginSession,
  type SessionRole,
} from '../types/types'

export function SessionDetailModal({
  session,
  roles,
  actorId,
  onClose,
  onRevoke,
}: {
  session: LoginSession
  roles: SessionRole[]
  actorId?: string
  onClose: () => void
  onRevoke: (session: LoginSession) => void
}) {
  const status = sessionStatus(session)
  const date = (value: string | null) =>
    value ? new Date(value).toLocaleString('en-GB') : 'Chưa thu hồi'
  return (
    <Modal title="Chi tiết phiên đăng nhập" closeLabel="Đóng" onClose={onClose}>
      <div className="space-y-5 p-5 sm:p-6">
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <h3 className="break-words text-lg font-semibold">
            {session.userName}
          </h3>
          <p className="mt-1 break-all text-sm text-slate-500">
            {session.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              tone={
                status === 'active'
                  ? 'green'
                  : status === 'expired'
                    ? 'amber'
                    : 'slate'
              }
            >
              {status === 'active'
                ? 'Đang hoạt động'
                : status === 'expired'
                  ? 'Đã hết hạn'
                  : 'Đã thu hồi'}
            </Badge>
            {session.isCurrent && (
              <span className="text-xs font-medium text-emerald-700">
                Phiên hiện tại
              </span>
            )}
          </div>
        </section>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            [
              'Vai trò',
              roles.find((item) => item.roleId === session.roleId)?.roleName ||
                session.roleId,
            ],
            ['Thiết bị', session.deviceType || 'Unknown'],
            ['Địa chỉ IP', session.ipAddress || 'Chưa có dữ liệu'],
            ['Đăng nhập lúc', date(session.loggedInAt)],
            ['Hết hạn lúc', date(session.expiresAt)],
            ['Đã thu hồi', date(session.revokedAt)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <dt className="text-xs font-medium text-slate-500">{label}</dt>
              <dd className="mt-1.5 break-words font-semibold text-slate-800">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <details className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-600">
            Thông tin trình duyệt
          </summary>
          <p className="mt-2 break-all text-sm leading-6 text-slate-600">
            {session.userAgent || 'Chưa có dữ liệu'}
          </p>
        </details>
        <details className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
          <summary className="cursor-pointer text-sm font-medium text-slate-600">
            Mã định danh phiên
          </summary>
          <dl className="mt-3 space-y-3">
            <div>
              <dt>Mã phiên</dt>
              <dd className="mt-1 break-all font-mono">
                {session.userSessionId}
              </dd>
            </div>
            <div>
              <dt>Mã người dùng</dt>
              <dd className="mt-1 break-all font-mono">{session.userId}</dd>
            </div>
          </dl>
        </details>
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            className={`${secondaryButton} flex-1 sm:flex-none sm:min-w-24`}
            onClick={onClose}
          >
            Đóng
          </button>
          {session.userId === actorId && status === 'active' && (
            <button
              className="min-h-11 flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 sm:flex-none"
              onClick={() => onRevoke(session)}
            >
              Thu hồi phiên
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
