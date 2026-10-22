import { DashboardWelcome } from '../components/DashboardWelcome'
import { useDashboard } from '../hooks/useDashboard'
import { DashboardStats } from '../components/DashboardStats'
import { StatusChart } from '../components/StatusChart'
import { DashboardAreas } from '../components/DashboardAreas'
import { DashboardSettings } from '../components/DashboardSettings'
export function DashboardPage() {
  const data = useDashboard()
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Tổng quan</h1>
      <DashboardWelcome />
      <DashboardStats
        users={data.users.length}
        active={data.activeUsers}
        newUsers={data.newUsers}
        tables={data.tables.length}
        areas={data.areas.length}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <StatusChart
          title="Tình trạng bàn"
          icon="utensils"
          label="Tổng bàn"
          items={data.tableStatus}
        />
        <StatusChart
          title="Tài khoản người dùng"
          icon="users"
          label="Tổng tài khoản"
          items={data.userStatus}
        />
        <DashboardAreas areas={data.areas} tables={data.tables} />
        <DashboardSettings fees={data.currentFees} methods={data.methods} />
      </div>
    </div>
  )
}
