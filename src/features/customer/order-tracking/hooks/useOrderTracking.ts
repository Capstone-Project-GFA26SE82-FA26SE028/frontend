import { useInfiniteQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getCustomerOrders } from '../api/orderTrackingApi'

export function useOrderTracking(enabled = true) {
  const table = useAppSelector((state) => state.customerSession.table)
  const sessionId = table?.tableSessionId
  const query = useInfiniteQuery({
    queryKey: ['customer-orders', sessionId],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      getCustomerOrders(sessionId!, pageParam, signal),
    getNextPageParam: (last, _pages, lastPage) =>
      last.length === 20 ? lastPage + 1 : undefined,
    enabled: !!sessionId && enabled,
    retry: false,
    refetchInterval: (current) => (current.state.error ? false : 15000),
    refetchOnWindowFocus: true,
  })
  const orders = [
    ...new Map(
      query.data?.pages.flat().map((order) => [order.orderId, order]),
    ).values(),
  ].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  return { table, orders, query }
}
