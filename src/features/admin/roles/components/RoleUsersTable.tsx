import { RoleUserFilters } from './RoleUserFilters'
import { roleColors } from '../data'
import {
  roleLabels,
  type Role,
  type AdminUser,
  type AdminRestaurant,
} from '../../users/types'
import {
  Panel,
  Badge,
  Pagination,
  EmptyState,
  secondaryButton,
} from '../../components/AdminUI'

export function RoleUsersTable({
  users,
  matchingUsers,
  status,
  onStatus,
  restaurants,
  role,
  onRole,
  query,
  onQuery,
  page,
  onPage,
  selected,
  onSelect,
}: {
  users: AdminUser[]
  matchingUsers: AdminUser[]
  status: string
  onStatus: (value: string) => void
  restaurants: AdminRestaurant[]
  role: Role | 'all'
  onRole: (role: Role | 'all') => void
  query: string
  onQuery: (query: string) => void
  page: number
  onPage: (page: number) => void
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <Panel>
      <RoleUserFilters
        query={query}
        role={role}
        status={status}
        matchingUsers={matchingUsers}
        onQuery={onQuery}
        onRole={onRole}
        onStatus={onStatus}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[740px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              {[
                'Tài khoản',
                'Vai trò',
                'Nhà hàng / Phạm vi',
                'Trạng thái',
                'Thao tác',
              ].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap px-5 py-3.5 font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.slice((page - 1) * 6, page * 6).map((u) => (
              <tr
                key={u.id}
                className={`border-t border-slate-100 ${selected === u.id ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
              >
                <td className="px-5 py-4">
                  <p className="font-semibold">{u.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{u.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      'inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ' +
                      roleColors[u.role]
                    }
                  >
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {u.role === 'Admin'
                    ? 'Toàn nền tảng'
                    : restaurants.find((r) => r.id === u.restaurantId)?.name ||
                      'Chưa phân công'}
                </td>
                <td className="px-5 py-4">
                  <Badge tone={u.active ? 'green' : 'red'}>
                    {u.active ? 'Hoạt động' : 'Đã khóa'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <button
                    aria-haspopup="dialog"
                    className={`${secondaryButton} whitespace-nowrap`}
                    onClick={() => onSelect(u.id)}
                  >
                    Đổi vai trò
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!users.length && (
        <EmptyState description="Chưa có tài khoản phù hợp với vai trò và từ khóa đã chọn." />
      )}
      <Pagination total={users.length} page={page} onPage={onPage} />
    </Panel>
  )
}
