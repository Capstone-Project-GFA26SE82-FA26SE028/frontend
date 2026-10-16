import { roles, roleLabels, type AdminUser } from '../../users/types'
import { Panel, EmptyState } from '../../components/AdminUI'
import { matches } from '../../utils'
import { roleDescriptions, roleColors } from '../data'

export function RoleTable({
  users,
  query,
}: {
  users: AdminUser[]
  query: string
}) {
  const rows = roles.filter((r) =>
    matches(query, r, roleLabels[r], roleDescriptions[r].scope),
  )
  return (
    <Panel>
      <h2 className="p-5 text-lg font-semibold">
        Danh sách vai trò{' '}
        <span className="ml-2 text-sm font-normal text-slate-600">
          {rows.length} vai trò cố định
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              {[
                'Vai trò',
                'Phạm vi dự kiến',
                'Nghiệp vụ dự kiến',
                'Tài khoản',
              ].map((h) => (
                <th key={h} scope="col" className="px-5 py-3.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p
                    className={
                      'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ' +
                      roleColors[r]
                    }
                  >
                    {roleLabels[r]}
                  </p>
                  <p className="mt-1 pl-[13px] text-xs text-slate-600">{r}</p>
                </td>
                <td className="max-w-56 px-5 py-5 leading-6 text-slate-600">
                  {roleDescriptions[r].scope}
                </td>
                <td className="px-5 py-4">
                  <ul className="space-y-2 text-slate-600">
                    {roleDescriptions[r].tasks.map((t) => (
                      <li key={t} className="flex items-start gap-2 leading-6">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald-600"
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-700">
                  <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-emerald-50 px-2.5 py-1.5">
                    {users.filter((u) => u.role === r).length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <EmptyState />}
    </Panel>
  )
}
