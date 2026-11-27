import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyBillVoucher, removeBillVoucher } from '../api/billApi'

export function useBillVoucher(billId: string, restaurantId: string, shiftId: string) {
  const client = useQueryClient()
  const billKey = ['cashier', 'bill-details', billId]

  return useMutation({
    mutationFn: (action: { code: string } | { voucherId: string }) =>
      'code' in action ? applyBillVoucher(billId, action.code) : removeBillVoucher(billId, action.voucherId),
    retry: false,
    onSuccess: async (bill) => {
      await client.cancelQueries({ queryKey: billKey, exact: true })
      client.setQueryData(billKey, bill)
    },
    onSettled: () => Promise.all([
      client.invalidateQueries({ queryKey: billKey, exact: true }),
      client.invalidateQueries({ queryKey: ['cashier', 'billing-queue', restaurantId, shiftId] }),
    ]),
  })
}