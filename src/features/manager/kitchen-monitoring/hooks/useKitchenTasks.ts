import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import {
  getKitchenTasks,
  getKitchenTables,
  getKitchenSummary,
  kitchenAccessDenied,
} from '../api/kitchenApi'
function useKitchenScope() {
  const user = useAppSelector((state) => state.auth.session?.user)
  return {
    restaurantId: user?.restaurantId || '',
    scope: [user?.userId, user?.restaurantId].join(':'),
    enabled: user?.roleId === 'manager' && !!user.restaurantId,
  }
}
const readPolicy = {
  retry: false,
  refetchInterval: (query: { state: { error: unknown } }) =>
    kitchenAccessDenied(query.state.error) ? (false as const) : 15000,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: (query: { state: { error: unknown } }) =>
    !kitchenAccessDenied(query.state.error),
}
export function useKitchenTasks() {
  const session = useKitchenScope()
  const query = useQuery({
    ...readPolicy,
    enabled: session.enabled,
    queryKey: ['manager-kitchen', session.scope, 'tasks'],
    queryFn: ({ signal }) => getKitchenTasks(signal),
  })
  return { ...query, scope: session.scope, restaurantId: session.restaurantId }
}
export function useOperationsTables() {
  const session = useKitchenScope()
  return useQuery({
    ...readPolicy,
    enabled: session.enabled,
    queryKey: ['manager-kitchen', session.scope, 'tables'],
    queryFn: ({ signal }) => getKitchenTables(session.restaurantId, signal),
  })
}
export function useKitchenSummary() {
  const session = useKitchenScope()
  return useQuery({
    ...readPolicy,
    enabled: session.enabled,
    queryKey: ['manager-kitchen', session.scope, 'summary'],
    queryFn: ({ signal }) => getKitchenSummary(signal),
  })
}
