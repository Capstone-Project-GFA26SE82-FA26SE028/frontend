import { PlatformDashboardWelcome } from '../components/PlatformDashboardWelcome'
import { PlatformDashboardStats } from '../components/PlatformDashboardStats'
import { RecentPlatformActivity } from '../components/RecentPlatformActivity'
import { PlatformAccountStatus } from '../components/PlatformAccountStatus'
import { PlatformRestaurants } from '../components/PlatformRestaurants'
import { usePlatformDashboard } from '../hooks/usePlatformDashboard'

export function PlatformAdminPage() {
  const { users, restaurants, activeSessions, activity } =
    usePlatformDashboard()

  return (
    <div className="space-y-4">
      <PlatformDashboardWelcome />
      <PlatformDashboardStats
        users={users}
        restaurants={restaurants}
        activeSessions={activeSessions}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <RecentPlatformActivity activity={activity} />
        <PlatformAccountStatus users={users} />
      </div>
      <PlatformRestaurants restaurants={restaurants} />
    </div>
  )
}
