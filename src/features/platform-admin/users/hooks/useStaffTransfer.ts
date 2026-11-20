import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAppSelector } from '../../../../app/hooks'
import {
  getStaffTransfer,
  staffTransferError,
  transferStaff,
} from '../api/staffTransferApi'

type TransferAttempt = { key: string; restaurantId: string }

function readAttempt(storageKey: string): TransferAttempt | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) || 'null')
    return value &&
      typeof value.key === 'string' &&
      typeof value.restaurantId === 'string'
      ? value
      : null
  } catch {
    return null
  }
}

export function useStaffTransfer(userId: string) {
  const actorId = useAppSelector((state) => state.auth.session?.user.userId)
  const storageKey = `dinelink-staff-transfer:${actorId}:${userId}`
  const [attempt, setAttempt] = useState(() => readAttempt(storageKey))
  const [restaurantId, setRestaurantId] = useState(attempt?.restaurantId || '')
  const [error, setError] = useState('')
  const client = useQueryClient()
  const notified = useRef('')
  const mutation = useMutation({
    mutationFn: (request: TransferAttempt) =>
      transferStaff(userId, request.restaurantId, request.key),
    retry: false,
  })
  const query = useQuery({
    queryKey: ['staff-transfer', attempt?.key],
    queryFn: ({ signal }) => getStaffTransfer(attempt!.key, signal),
    enabled: !!attempt && !mutation.isPending,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.status === 'Pending' ? 3000 : false,
  })
  const transfer = attempt ? query.data : undefined
  const finished =
    transfer?.status === 'Completed' || transfer?.status === 'Rejected'

  useEffect(() => {
    if (
      !transfer ||
      transfer.status === 'Pending' ||
      notified.current === transfer.id
    )
      return
    notified.current = transfer.id
    sessionStorage.removeItem(storageKey)
    void client.invalidateQueries({ queryKey: ['users'] })
    void client.invalidateQueries({ queryKey: ['restaurants', 'staff'] })
    if (transfer.status === 'Completed')
      toast.success('Đã chuyển nhân viên sang nhà hàng mới.')
    else
      toast.error(
        transfer.message ||
          'Không thể chuyển nhân viên. Nhân viên vẫn thuộc nhà hàng cũ.',
      )
  }, [transfer, storageKey, client])

  async function submit() {
    if (
      !restaurantId ||
      mutation.isPending ||
      finished ||
      transfer?.status === 'Pending'
    )
      return
    const request = attempt || { restaurantId, key: crypto.randomUUID() }
    // Preserve the request ID after a timeout, closing the modal or reloading the page.
    sessionStorage.setItem(storageKey, JSON.stringify(request))
    setAttempt(request)
    setError('')
    try {
      const response = await mutation.mutateAsync(request)
      client.setQueryData(['staff-transfer', request.key], response)
      void client.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError(staffTransferError(error))
      if (
        axios.isAxiosError(error) &&
        [400, 403, 404, 409, 422].includes(error.response?.status || 0)
      ) {
        sessionStorage.removeItem(storageKey)
        setAttempt(null)
      }
    }
  }

  return {
    restaurantId,
    setRestaurantId,
    submit,
    transfer,
    finished,
    hasAttempt: !!attempt,
    pending: mutation.isPending,
    locked: !!attempt && !finished,
    error: query.isError ? staffTransferError(query.error) : error,
    checking: query.isFetching,
    canRetry:
      !!attempt &&
      !transfer &&
      query.isError &&
      !query.isFetching &&
      !mutation.isPending,
    check: () => {
      setError('')
      void query.refetch()
    },
  }
}
