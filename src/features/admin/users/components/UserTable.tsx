import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { Badge } from '../../../../components/Badge/Badge'
import { UserAvatar } from './UserAvatar'
import { userRoleLabel, type UserAccount } from '../types/types'
import { UserActions, type UserActionHandlers } from './UserActions'
import { RoleBadge } from '../../roles/components/RoleBadge'
export function UserTable({
  visible,
  onDetail,
  onEdit,
  onStatus,
}: UserActionHandlers & {
  visible: UserAccount[]
}) {
  return !visible.length ? (
    <EmptyState
      title="Không tìm thấy người dùng"
      description="Thử thay đổi nội dung tìm kiếm hoặc bộ lọc."
    />
  ) : (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-sm text-slate-600">
            <tr>
              {[
                'Người dùng',
                'Vai trò',
                'Tên đăng nhập',
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
                    <UserAvatar src={u.avatarUrl} name={u.name} />
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {u.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5">
                  <RoleBadge id={u.role} name={userRoleLabel(u.role)} />
                </td>
                <td className="px-5 text-slate-500">{u.userName}</td>
                <td className="px-5">
                  <Badge tone={u.active ? 'green' : 'red'}>
                    {u.active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
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
            <UserAvatar src={u.avatarUrl} name={u.name} />
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
                {u.active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              <RoleBadge id={u.role} name={userRoleLabel(u.role)} /> ·{' '}
              {u.userName}
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
