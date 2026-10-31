import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { Panel } from '../../../../components/Panel/Panel'
import { RoleBadge } from './RoleBadge'
import type { SystemRole } from '../types/types'

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
              {['Vai trò', 'Mô tả', 'Tài khoản'].map((label) => (
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
                  <RoleBadge id={item.roleId} name={item.roleName} />
                  <p className="mt-1 pl-[13px] text-xs text-slate-500">
                    {item.roleId}
                  </p>
                </td>
                <td className="px-5 py-4 leading-6 text-slate-600">
                  {item.description || 'Chưa có mô tả.'}
                </td>
                <td className="w-40 px-5 py-4">
                  <button
                    aria-label={'Xem tài khoản có vai trò ' + item.roleName}
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
          title="Không tìm thấy vai trò"
          description="Chưa có vai trò hệ thống."
        />
      )}
    </Panel>
  )
}
