import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { acceptTakeawayOrder, getOrdersAwaitingConfirmation } from '../api/takeawayOrdersApi'
import type { CashierTakeawayOrder } from '../types/types'

export function useTakeawayOrders(restaurantId: string, userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['cashier', 'takeaway-orders', restaurantId, userId]
  const orders = useQuery({
    queryKey,
    queryFn: ({ signal }) => getOrdersAwaitingConfirmation(restaurantId, signal),
    enabled: !!restaurantId,
    retry: false,
    refetchInterval: 5000,
  })
  const accept = useMutation({
    mutationFn: (order: CashierTakeawayOrder) => acceptTakeawayOrder(restaurantId, order),
    onSuccess: () => toast.success('Đã xác nhận đơn và chuyển món xuống bếp.'),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
  return { orders, accept }
}
