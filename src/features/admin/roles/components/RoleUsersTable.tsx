import { roleColor } from '../roleStyles'
import { UserAvatar } from '../../users/components/UserAvatar'
import type { RoleAccount, SystemRole } from '../types'
import {
  Badge,
  Pagination,
  EmptyState,
  secondaryButton,
} from '../../components/AdminUI'

export function RoleUsersTable({
  users,
  roles,
  total,
  page,
  pageSize,
  busy,
  onPage,
  onSelect,
}: {
  users: RoleAccount[]
  roles: SystemRole[]
  total: number
  page: number
  pageSize: number
  busy: boolean
  onPage: (page: number) => void
  onSelect: (user: RoleAccount) => void
}) {
  return (
    <fieldset disabled={busy} aria-busy={busy} className="min-w-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              {['Account', 'Username', 'Role', 'Status', 'Actions'].map(
                (label) => (
                  <th
                    key={label}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3.5 font-semibold"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userId}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={user.avatarUrl}
                      name={user.fullName || user.userName}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {user.fullName || user.userName}
                      </p>
                      <p className="mt-1 text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">{user.userName}</td>
                <td className="px-5 py-4">
                  <span
                    className={
                      'inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ' +
                      roleColor(user.roleId)
                    }
                  >
                    {roles.find((item) => item.roleId === user.roleId)
                      ?.roleName || user.roleId}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={user.isActive ? 'green' : 'red'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <button
                    aria-label={
                      'Change role for ' + (user.fullName || user.userName)
                    }
                    aria-haspopup="dialog"
                    className={`${secondaryButton} whitespace-nowrap`}
                    onClick={() => onSelect(user)}
                  >
                    Change role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!users.length && (
        <EmptyState
          title="No accounts found"
          description="Try changing the search or filters."
        />
      )}
      <Pagination
        total={total}
        page={page}
        size={pageSize}
        locale="en"
        onPage={onPage}
      />
    </fieldset>
  )
}
