import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getStaffActivity, type ActivityFilters } from '../api/staffActivityApi'

export function useStaffActivity(filters: ActivityFilters) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId || ''
  const enabled = user?.roleId === 'manager' && !!restaurantId
  const query = useQuery({
    queryKey: ['manager-staff-activity', user?.userId, restaurantId, filters],
    queryFn: ({ signal }) => getStaffActivity(restaurantId, filters, signal),
    enabled,
    retry: false,
  })
  return { ...query, enabled }
}
