import { SummaryCards } from '../../components/AdminUI'
import { roles, type AdminUser } from '../../users/types'
export function RoleSummaryCards({ users }: { users: AdminUser[] }) {
  return (
    <SummaryCards
      items={[
        {
          label: 'Vai trò hệ thống',
          value: roles.length,
          icon: 'shield',
          note: 'Danh mục cố định',
        },
        {
          label: 'Tài khoản',
          value: users.length,
          icon: 'users',
          note: 'Trên toàn nền tảng',
        },
        {
          label: 'Admin hoạt động',
          value: users.filter((u) => u.role === 'Admin' && u.active).length,
          icon: 'shield',
          note: 'Luôn giữ ít nhất một tài khoản',
        },
        {
          label: 'Được phân công nhà hàng',
          value: users.filter((u) => u.role !== 'Admin' && u.restaurantId)
            .length,
          icon: 'store',
          note: 'Bao gồm tài khoản đang khóa',
        },
      ]}
    />
  )
}
