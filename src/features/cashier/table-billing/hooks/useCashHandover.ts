import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { confirmCashHandover, findCashHandover } from '../api/cashHandoverApi'

export function useCashHandover(
  restaurantId: string,
  registerId: string,
  shiftId: string,
  billId: string,
  onPaid: (billId: string) => void,
) {
  const client = useQueryClient()
  const key = ['cashier', 'cash-handover', registerId, shiftId, billId]
  const handover = useQuery({
    queryKey: key,
    queryFn: ({ signal }) =>
      findCashHandover(registerId, shiftId, billId, signal),
    retry: false,
  })
  const confirm = useMutation({
    mutationFn: ({
      paymentId,
      amount,
    }: {
      paymentId: string
      amount: number
    }) => confirmCashHandover(paymentId, amount),
    retry: false,
    onSuccess: () => {
      onPaid(billId)
      toast.success('Đã xác nhận nhận tiền mặt.')
    },
    onSettled: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({
          queryKey: ['cashier', 'bill-details', billId],
        }),
        client.invalidateQueries({
          queryKey: ['cashier', 'billing-queue', restaurantId, shiftId],
        }),
        client.invalidateQueries({
          queryKey: ['cashier', 'billing-areas', restaurantId, shiftId],
        }),
      ]),
  })
  return { handover, confirm }
}
