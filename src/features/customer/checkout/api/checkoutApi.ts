import axios from 'axios'
import type { CheckoutAttempt, SubmittedOrder } from '../types/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})

function path(sessionId: string) {
  return '/table-sessions/' + encodeURIComponent(sessionId) + '/orders'
}

function result(data: {
  isSuccess: boolean
  message?: string
  result: SubmittedOrder
}) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Unable to submit your order.')
  return data.result
}

export async function submitOrder(sessionId: string, attempt: CheckoutAttempt) {
  const { data } = await client.post(path(sessionId), attempt.request, {
    headers: { 'Idempotency-Key': attempt.key },
  })
  return result(data)
}

export async function getSubmittedOrder(
  sessionId: string,
  orderId: string,
  signal?: AbortSignal,
) {
  const { data } = await client.get(
    path(sessionId) + '/' + encodeURIComponent(orderId),
    { signal },
  )
  return result(data)
}

// Only a definitive client rejection allows a new request. Network/5xx failures
// may happen after commit, so retries must retain the same key and payload.
export function isOrderRejected(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    !!error.response &&
    [400, 401, 403, 404, 409, 422].includes(error.response.status)
  )
}

export function checkoutError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if ([401, 403].includes(error.response?.status ?? 0))
      return 'Table access expired. Scan your table QR code again.'
    if (!isOrderRejected(error))
      return 'We could not confirm the result. Retry the same request to check your order safely.'
    return typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : 'Your cart could not be submitted. Reload and review it before trying again.'
  }
  return error instanceof Error ? error.message : 'Unable to submit your order.'
}
