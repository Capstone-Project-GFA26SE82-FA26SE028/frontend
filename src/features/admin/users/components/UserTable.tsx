import { Badge, EmptyState } from '../../components/AdminUI'
import { roleLabels, type AdminUser, type Role } from '../types'
import { UserActions, type UserActionHandlers } from './UserActions'
const roleColors: Record<Role, string> = {
  Admin: 'border-blue-200 bg-blue-100 text-blue-900',
  Manager: 'border-violet-200 bg-violet-100 text-violet-900',
  Waiter: 'border-cyan-200 bg-cyan-100 text-cyan-900',
  Cashier: 'border-emerald-200 bg-emerald-100 text-emerald-900',
  Kitchen: 'border-orange-200 bg-orange-100 text-orange-900',
  Inventory: 'border-amber-200 bg-amber-100 text-amber-900',
  Supplier: 'border-slate-300 bg-slate-200 text-slate-800',
}
function renderRole(role: Role) {
  return (
    <span
      className={
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ' +
        roleColors[role]
      }
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {roleLabels[role]}
    </span>
  )
}
export function UserTable({
  visible,
  restaurantName,
  onDetail,
  onEdit,
  onStatus,
}: UserActionHandlers & {
  visible: AdminUser[]
  restaurantName: (id: string) => string
}) {
  return !visible.length ? (
    <EmptyState />
  ) : (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-sm text-slate-600">
            <tr>
              {[
                'Người dùng',
                'Vai trò',
                'Phạm vi',
                'Trạng thái',
                'Thao tác',
              ].map((h) => (
                <th key={h} scope="col" className="px-5 py-3.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((u) => (
              <tr
                key={u.id}
                className="border-t border-slate-100 hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-700">
                      {u.name.split(' ').at(-1)?.[0]}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {u.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5">{renderRole(u.role)}</td>
                <td className="px-5 text-slate-500">
                  {restaurantName(u.restaurantId)}
                </td>
                <td className="px-5">
                  <Badge tone={u.active ? 'green' : 'red'}>
                    {u.active ? 'Hoạt động' : 'Đã khóa'}
                  </Badge>
                </td>
                <td className="px-3">
                  <UserActions
                    user={u}
                    onDetail={onDetail}
                    onEdit={onEdit}
                    onStatus={onStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {visible.map((u) => (
          <article key={u.id} className="space-y-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {u.name}
                </h3>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {u.email}
                </p>
              </div>
              <Badge tone={u.active ? 'green' : 'red'}>
                {u.active ? 'Hoạt động' : 'Đã khóa'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              {renderRole(u.role)} · {restaurantName(u.restaurantId)}
            </p>
            <UserActions
              user={u}
              onDetail={onDetail}
              onEdit={onEdit}
              onStatus={onStatus}
            />
          </article>
        ))}
      </div>
    </>
  )
}
