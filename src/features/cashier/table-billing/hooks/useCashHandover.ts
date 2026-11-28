import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { confirmCashHandover, findCashHandover, getCashHandoverError } from '../api/cashHandoverApi'
import { formatCurrency } from '../../../../utils/currency'

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
    onError: (error) => {
      const result = getCashHandoverError(error)
      if (result?.status !== 'CashReturnRequired') return
      const amount = result.amount == null ? 'toàn bộ tiền mặt' : formatCurrency(result.amount)
      toast.warning(`Khách đã thanh toán qua PayOS. Trả lại ${amount} đã nhận.`, { autoClose: false })
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
