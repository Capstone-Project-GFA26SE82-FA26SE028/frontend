import { sessionStatus, type LoginSession, type SessionRole } from '../types'
import { Badge, EmptyState, secondaryButton } from '../../components/AdminUI'

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
export function SessionTable({
  sessions,
  roles,

  onDetail,
}: {
  sessions: LoginSession[]
  roles: SessionRole[]

  onDetail: (session: LoginSession) => void
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              {[
                'Account',
                'Role',
                'Device / IP',
                'Signed in',
                'Status',
                'Actions',
              ].map((label) => (
                <th
                  scope="col"
                  key={label}
                  className="px-4 py-3.5 font-semibold"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const status = sessionStatus(session)
              const device = session.deviceType || 'Unknown'
              return (
                <tr
                  key={session.userSessionId}
                  className="border-t border-slate-100 align-middle hover:bg-slate-50/60"
                >
                  <td className="p-4">
                    <p className="font-semibold">{session.userName}</p>
                    <p className="mt-1 text-slate-500">{session.email}</p>
                  </td>
                  <td className="p-4 text-slate-600">
                    {roles.find((item) => item.roleId === session.roleId)
                      ?.roleName || session.roleId}
                  </td>
                  <td className="max-w-64 p-4">
                    <p className="font-medium">{device}</p>
                    <p className="mt-1 text-slate-500">
                      {session.ipAddress || 'IP unavailable'}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="whitespace-nowrap text-slate-600">
                      {formatDate(session.loggedInAt)}
                    </span>
                  </td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4">
                    <button
                      aria-label={
                        'View session details for ' +
                        session.userName +
                        ' on ' +
                        device
                      }
                      aria-haspopup="dialog"
                      className={`${secondaryButton} whitespace-nowrap`}
                      onClick={() => onDetail(session)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!sessions.length && (
        <EmptyState
          title="No sessions found"
          description="Try changing the search or filters."
        />
      )}
    </>
  )
}
