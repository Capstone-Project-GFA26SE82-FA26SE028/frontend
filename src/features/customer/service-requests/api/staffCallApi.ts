import axios from 'axios'
import type { StaffCall } from '../types/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15_000,
})

type StaffCallResponse = {
  isSuccess: boolean
  message?: string | null
  result: StaffCall
}

function readCall(data: StaffCallResponse) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể xử lý yêu cầu.')
  return data.result
}

export async function getStaffCall(
  sessionId: string,
  id: string,
  signal: AbortSignal,
) {
  try {
    const { data } = await client.get<StaffCallResponse>(
      `/table-sessions/${sessionId}/staff-calls/${id}`,
      { signal },
    )
    return readCall(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function sendStaffCall(sessionId: string, requestKey: string) {
  const { data } = await client.post<StaffCallResponse>(
    `/table-sessions/${sessionId}/staff-calls`,
    undefined,
    { headers: { 'Idempotency-Key': requestKey } },
  )
  return readCall(data)
}
