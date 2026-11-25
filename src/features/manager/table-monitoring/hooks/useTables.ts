import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getAreas, getTables } from '../api/tableApi'
import type { TableFilters } from '../types/table'
export function useTables(filters: TableFilters, areaScope: string) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId || ''
  const scope = [user?.userId, restaurantId]
  const scopedFilters = {
    ...filters,
    areaId: areaScope === scope.join(':') ? filters.areaId : '',
  }
  const enabled = !!restaurantId && user?.roleId === 'manager'
  const options = {
    enabled,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
  } as const
  const tables = useQuery({
    ...options,
    queryKey: ['manager-tables', ...scope, scopedFilters],
    queryFn: ({ signal }) => getTables(restaurantId, scopedFilters, signal),
  })
  const areas = useQuery({
    ...options,
    queryKey: ['manager-table-areas', ...scope],
    queryFn: ({ signal }) => getAreas(restaurantId, signal),
  })
  return { tables, areas, restaurantId, scope: scope.join(':') }
}
