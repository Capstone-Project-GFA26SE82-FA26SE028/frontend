import { Modal } from '../../../../components/Modal/Modal'
import { Badge, secondaryButton } from '../../components/AdminUI'
import { sessionStatus, type LoginSession, type SessionRole } from '../types'

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
    value ? new Date(value).toLocaleString('en-GB') : 'Not revoked'
  return (
    <Modal title="Session details" closeLabel="Close" onClose={onClose}>
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
                ? 'Active'
                : status === 'expired'
                  ? 'Expired'
                  : 'Revoked'}
            </Badge>
            {session.isCurrent && (
              <span className="text-xs font-medium text-emerald-700">
                Current session
              </span>
            )}
          </div>
        </section>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            [
              'Role',
              roles.find((item) => item.roleId === session.roleId)?.roleName ||
                session.roleId,
            ],
            ['Device', session.deviceType || 'Unknown'],
            ['IP address', session.ipAddress || 'Not available'],
            ['Signed in', date(session.loggedInAt)],
            ['Expires', date(session.expiresAt)],
            ['Revoked', date(session.revokedAt)],
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
            Browser details
          </summary>
          <p className="mt-2 break-all text-sm leading-6 text-slate-600">
            {session.userAgent || 'Not available'}
          </p>
        </details>
        <details className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
          <summary className="cursor-pointer text-sm font-medium text-slate-600">Session identifiers</summary>
          <dl className="mt-3 space-y-3">
            <div>
              <dt>Session ID</dt>
              <dd className="mt-1 break-all font-mono">
                {session.userSessionId}
              </dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd className="mt-1 break-all font-mono">{session.userId}</dd>
            </div>
          </dl>
        </details>
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <button className={`${secondaryButton} flex-1 sm:flex-none sm:min-w-24`} onClick={onClose}>
            Close
          </button>
          {session.userId === actorId && status === 'active' && (
            <button
              className="min-h-11 flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 sm:flex-none"
              onClick={() => onRevoke(session)}
            >
              Revoke session
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
