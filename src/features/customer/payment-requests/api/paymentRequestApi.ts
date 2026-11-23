import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15_000,
})

export type PaymentRequest = {
  serviceRequestId: string
  status: 'Requested' | 'Acknowledged' | 'Completed'
}

type PaymentRequestResponse = {
  result: PaymentRequest
}

export async function getPaymentRequest(
  sessionId: string,
  id: string,
  signal: AbortSignal,
) {
  try {
    const { data } = await client.get<PaymentRequestResponse>(
      `/table-sessions/${sessionId}/payment-requests/${id}`,
      { signal },
    )
    return data.result
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function sendPaymentRequest(sessionId: string, key: string) {
  const { data } = await client.post<PaymentRequestResponse>(
    `/table-sessions/${sessionId}/payment-requests`,
    undefined,
    { headers: { 'Idempotency-Key': key } },
  )
  return data.result
}
