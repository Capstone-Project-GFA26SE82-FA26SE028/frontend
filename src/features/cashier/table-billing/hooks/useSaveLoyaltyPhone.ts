import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveBillLoyaltyPhone } from '../api/billApi'

export function useSaveLoyaltyPhone(billId: string) {
  const client = useQueryClient()
  const queryKey = ['cashier', 'bill-details', billId]
  return useMutation({
    mutationFn: (phoneNumber: string) => saveBillLoyaltyPhone(billId, phoneNumber),
    retry: false,
    onSuccess: async (bill) => {
      await client.cancelQueries({ queryKey, exact: true })
      client.setQueryData(queryKey, bill)
    },
    onSettled: () => client.invalidateQueries({ queryKey, exact: true }),
  })
}
