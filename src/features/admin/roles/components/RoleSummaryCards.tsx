import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
export function RoleSummaryCards({
  roleCount,
  totals,
}: {
  roleCount?: number
  totals?: { total: number; active: number }
}) {
  return (
    <SummaryCards
      items={[
        {
          label: 'Vai trò nhân viên',
          value: roleCount ?? '—',
          icon: 'shield',
          note: 'Các vai trò cố định',
        },
        {
          label: 'Tài khoản',
          value: totals?.total ?? '—',
          icon: 'users',
          note: 'Nhân viên trong nhà hàng',
        },
        {
          label: 'Tài khoản hoạt động',
          value: totals?.active ?? '—',
          icon: 'users',
          note: 'Đang được kích hoạt',
        },
      ]}
    />
  )
}
