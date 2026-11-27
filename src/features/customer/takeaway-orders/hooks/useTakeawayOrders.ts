import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { cancelTakeawayOrder, getTakeawayOrders } from '../api/takeawayOrdersApi'

const pageSize = 10

export function useTakeawayOrders() {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const orders = useQuery({
    queryKey: ['takeaway-orders', userId, status, page],
    queryFn: ({ signal }) => getTakeawayOrders(page, pageSize, signal, status || undefined),
    enabled: !!userId,
    retry: false,
  })

  const cancellation = useMutation({
    mutationFn: ({ restaurantId, orderId }: { restaurantId: string; orderId: string }) =>
      cancelTakeawayOrder(restaurantId, orderId),
    onSettled: (_data, _error, { restaurantId, orderId }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders', userId] }),
      queryClient.invalidateQueries({ queryKey: ['takeaway-order', userId, restaurantId, orderId] }),
    ]),
  })

  function changeStatus(nextStatus: string) {
    setStatus(nextStatus)
    setPage(1)
  }

  return { orders, cancellation, page, setPage, status, changeStatus, hasNextPage: !!orders.data && orders.data.page * orders.data.pageSize < orders.data.totalCount }
}