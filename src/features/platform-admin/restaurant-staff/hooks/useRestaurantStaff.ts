import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  assignRestaurantStaff,
  getRestaurantStaff,
  removeRestaurantStaff,
  restaurantStaffError,
} from '../api/restaurantStaffApi'

export function useRestaurantStaff(restaurantId: string) {
  const client = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const key = ['restaurants', 'staff', restaurantId]
  const list = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getRestaurantStaff(restaurantId, signal),
    retry: false,
  })
  const active = (list.data || []).filter((assignment) => assignment.isActive)
  const change = useMutation({
    mutationFn: ({ userId, remove }: { userId: string; remove: boolean }) =>
      remove
        ? removeRestaurantStaff(restaurantId, userId)
        : assignRestaurantStaff(restaurantId, userId),
    retry: false,
    onSuccess: (saved, variables) => {
      client.setQueryData<typeof list.data>(key, (old) => [
        ...(old || []).filter((row) => row.userIdRef !== saved.userIdRef),
        saved,
      ])
      setRemoving(null)
      if (!variables.remove) setAdding(false)
      toast.success(
        variables.remove
          ? 'Đã gỡ nhân viên khỏi nhà hàng.'
          : 'Đã thêm nhân viên vào nhà hàng.',
      )
    },
    onError: (error) => toast.error(restaurantStaffError(error)),
    onSettled: () => {
      void client.invalidateQueries({ queryKey: key })
    },
  })
  return {
    list,
    active,
    change,
    adding,
    setAdding,
    removing,
    setRemoving,
  }
}
