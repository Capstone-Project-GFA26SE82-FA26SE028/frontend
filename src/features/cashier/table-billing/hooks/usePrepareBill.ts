import { useMutation, useQueryClient } from '@tanstack/react-query'
import { prepareCashierBill } from '../api/billApi'
import type { BillingEntry } from '../types/types'

export function usePrepareBill(
  restaurantId: string,
  cashShiftId: string,
  onPrepared: (entry: BillingEntry, billId: string) => void,
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (entry: BillingEntry & { checkoutId: string }) =>
      prepareCashierBill(entry.tableSessionId, entry.checkoutId),
    retry: false,
    onSuccess: (bill, entry) => {
      client.setQueryData(['cashier', 'bill-details', bill.billId], bill)
      onPrepared(entry, bill.billId)
    },
    onSettled: () =>
      Promise.all([
        client.invalidateQueries({
          queryKey: ['cashier', 'billing-queue', restaurantId, cashShiftId],
        }),
        client.invalidateQueries({
          queryKey: ['cashier', 'billing-areas', restaurantId, cashShiftId],
        }),
      ]),
  })
}
