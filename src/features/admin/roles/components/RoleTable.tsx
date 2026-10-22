import { Panel, EmptyState } from '../../components/AdminUI'
import { roleColor } from '../roleStyles'
import type { SystemRole } from '../types'

export function RoleTable({
  roles,
  counts,
  onViewUsers,
}: {
  roles: SystemRole[]
  counts: Record<string, number | undefined>
  onViewUsers: (id: string) => void
}) {
  return (
    <Panel>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              {['Role', 'Description', 'Accounts'].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="px-5 py-3.5 font-semibold"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((item) => (
              <tr
                key={item.roleId}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="w-64 px-5 py-4">
                  <span
                    className={
                      'inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ' +
                      roleColor(item.roleId)
                    }
                  >
                    {item.roleName}
                  </span>
                  <p className="mt-1 pl-[13px] text-xs text-slate-500">
                    {item.roleId}
                  </p>
                </td>
                <td className="px-5 py-4 leading-6 text-slate-600">
                  {item.description || 'No description provided.'}
                </td>
                <td className="w-40 px-5 py-4">
                  <button
                    aria-label={'View accounts with role ' + item.roleName}
                    onClick={() => onViewUsers(item.roleId)}
                    className="inline-flex min-h-10 min-w-12 items-center justify-center rounded-lg bg-emerald-50 px-3 font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    {counts[item.roleId] ?? '—'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!roles.length && (
        <EmptyState
          title="No roles found"
          description="No system roles are available."
        />
      )}
    </Panel>
  )
}
