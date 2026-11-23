import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useRef } from 'react'
import { getPaymentRequest, sendPaymentRequest } from '../api/paymentRequestApi'
import type { PaymentRequest } from '../api/paymentRequestApi'

export function usePaymentRequest(sessionId: string) {
  const client = useQueryClient()
  const queryKey = ['customer-payment-request', sessionId]
  const attempt = useRef<string | null>(null)
  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const current = await getPaymentRequest(sessionId, 'current', signal)
      if (current) return current
      const previous = client.getQueryData<PaymentRequest | null>(queryKey)
      if (previous?.status === 'Completed') return previous
      return previous
        ? getPaymentRequest(sessionId, previous.serviceRequestId, signal)
        : null
    },
    retry: false,
    refetchInterval: (result) => {
      const status = result.state.data?.status
      return status && status !== 'Completed' ? 5_000 : false
    },
  })
  const send = useMutation({
    mutationFn: () => {
      attempt.current ??= crypto.randomUUID()
      return sendPaymentRequest(sessionId, attempt.current)
    },
    onMutate: () => client.cancelQueries({ queryKey }),
    onSuccess: (request) => {
      attempt.current = null
      client.setQueryData(queryKey, request)
    },
    onError: (error) => {
      const status = isAxiosError(error) ? error.response?.status : undefined
      if (status && status >= 400 && status < 500) attempt.current = null
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
  })
  return { query, send }
}
