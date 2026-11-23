import axios from 'axios'
import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStaffCall, sendStaffCall } from '../api/staffCallApi'
import type { StaffCall } from '../types/types'

export function useStaffCall(sessionId: string, open: boolean) {
  const client = useQueryClient()
  const key = ['customer', 'staff-call', sessionId]
  const attempt = useRef<string | null>(null)
  const call = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const current = await getStaffCall(sessionId, 'current', signal)
      if (current) return current
      const previous = client.getQueryData<StaffCall | null>(key)
      return previous?.serviceRequestId
        ? getStaffCall(sessionId, previous.serviceRequestId, signal)
        : null
    },
    enabled: open,
    retry: false,
    refetchInterval: open ? 5_000 : false,
  })
  const send = useMutation({
    mutationFn: () => {
      attempt.current ??= crypto.randomUUID()
      return sendStaffCall(sessionId, attempt.current)
    },
    retry: false,
    onMutate: () => client.cancelQueries({ queryKey: key }),
    onSuccess: (data) => {
      attempt.current = null
      client.setQueryData(key, data)
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined
      if (status && status >= 400 && status < 500) attempt.current = null
    },
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  })
  return { call, send }
}
