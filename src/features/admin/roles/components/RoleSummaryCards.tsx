import { SummaryCards } from '../../components/AdminUI'
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
          label: 'System roles',
          value: roleCount ?? '—',
          icon: 'shield',
          note: 'Fixed roles',
        },
        {
          label: 'Accounts',
          value: totals?.total ?? '—',
          icon: 'users',
          note: 'All user accounts',
        },
        {
          label: 'Active accounts',
          value: totals?.active ?? '—',
          icon: 'users',
          note: 'Currently enabled',
        },
        {
          label: 'Active administrators',
          value: totals?.admins ?? '—',
          icon: 'shield',
          note: 'At least one is required',
        },
      ]}
    />
  )
}
