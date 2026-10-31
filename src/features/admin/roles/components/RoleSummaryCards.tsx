import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
export function RoleSummaryCards({
  roleCount,
  totals,
}: {
  roleCount?: number
  totals?: { total: number; active: number; admins: number }
}) {
  return (
    <SummaryCards
      items={[
        {
          label: 'Vai trò hệ thống',
          value: roleCount ?? '—',
          icon: 'shield',
          note: 'Các vai trò cố định',
        },
        {
          label: 'Tài khoản',
          value: totals?.total ?? '—',
          icon: 'users',
          note: 'Tất cả tài khoản người dùng',
        },
        {
          label: 'Tài khoản hoạt động',
          value: totals?.active ?? '—',
          icon: 'users',
          note: 'Đang được kích hoạt',
        },
        {
          label: 'Quản trị viên hoạt động',
          value: totals?.admins ?? '—',
          icon: 'shield',
          note: 'Cần có ít nhất một người',
        },
      ]}
    />
  )
}
