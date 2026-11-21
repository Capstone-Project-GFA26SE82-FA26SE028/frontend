import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import { getShiftWorkspace, openCashShift } from '../api/cashShiftApi'

export function useCashShift() {
  const user = useAppSelector((state) => state.auth.session!.user)
  const restaurantId = user.restaurantId || ''
  const client = useQueryClient()
  const key = ['cashier', 'current-shift', user.userId, restaurantId]
  const workspace = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getShiftWorkspace(restaurantId, signal),
    enabled: !!restaurantId,
    retry: false,
    refetchOnWindowFocus: true,
  })
  const open = useMutation({
    mutationFn: (amount: number) => openCashShift(restaurantId, amount),
    retry: false,
    onSuccess: () => toast.success('Đã mở ca làm việc.'),
    // Always recheck after a failed POST: the server may have opened the shift
    // even if the response did not reach this browser.
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  })
  return { user, restaurantId, workspace, open }
}
