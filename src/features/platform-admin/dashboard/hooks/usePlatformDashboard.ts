import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getActivityLogs } from '../../activity/api/activityApi'
import { getRestaurants } from '../../restaurants/api/restaurantApi'
import { getSessions } from '../../sessions/api/sessionApi'
import { useUserCounts } from '../../users/hooks/useUsers'

export function usePlatformDashboard() {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const users = useUserCounts()
  const restaurantParams = { page: 1, pageSize: 4 }
  const restaurants = useQuery({
    queryKey: [
      'restaurants',
      'list',
      'platform-dashboard',
      userId,
      restaurantParams,
    ],
    queryFn: ({ signal }) => getRestaurants(restaurantParams, signal),
  })
  const activeSessions = useQuery({
    queryKey: ['sessions', 'platform-dashboard', userId],
    queryFn: ({ signal }) =>
      getSessions({ page: 1, pageSize: 1, status: 'active' }, signal),
  })
  const activity = useQuery({
    queryKey: ['audit-logs', 'platform-dashboard', userId],
    queryFn: ({ signal }) => getActivityLogs({ page: 1, pageSize: 5 }, signal),
  })

  return { users, restaurants, activeSessions, activity }
}
