import { z } from 'zod'
import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import { tierSchema } from '../schemas/loyaltySchema'

const policySchema = z.object({
  policyId: z.string(),
  restaurantId: z.string(),
  version: z.number(),
  spendPerPoint: z.number().positive(),
  moneyPerRedeemedPoint: z.number().positive(),
  effectiveFrom: z.string(),
})
export type LoyaltyTier = z.infer<typeof tierSchema>
export type LoyaltyPolicy = z.infer<typeof policySchema>
export type TierInput = Omit<LoyaltyTier, 'loyaltyTierId'>
export type PolicyInput = Pick<LoyaltyPolicy, 'spendPerPoint' | 'moneyPerRedeemedPoint'>

function unwrap<T>(data: unknown, schema: z.ZodType<T>): T {
  const envelope = z.object({ isSuccess: z.boolean(), message: z.string().nullish(), result: z.unknown() }).parse(data)
  if (!envelope.isSuccess) throw new Error(envelope.message || 'Không thể tải cấu hình thành viên.')
  return schema.parse(envelope.result)
}

const base = (restaurantId: string) => `/restaurants/${restaurantId}/loyalty`

export async function getTiers(restaurantId: string, signal: AbortSignal) {
  const { data } = await axiosClient.get(`${base(restaurantId)}/tiers`, { signal })
  return unwrap(data, z.array(tierSchema))
}

export async function getPolicy(restaurantId: string, signal: AbortSignal) {
  const { data } = await axiosClient.get(`${base(restaurantId)}/policy`, { signal })
  return unwrap(data, policySchema)
}

export async function saveTier(restaurantId: string, values: TierInput, tierId?: string) {
  const { data } = await axiosClient.request({
    method: tierId ? 'put' : 'post',
    url: `${base(restaurantId)}/tiers${tierId ? `/${tierId}` : ''}`,
    data: values,
  })
  return unwrap(data, tierSchema)
}

export async function savePolicy(restaurantId: string, values: PolicyInput) {
  const { data } = await axiosClient.put(`${base(restaurantId)}/policy`, values)
  return unwrap(data, policySchema)
}

export function loyaltyError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  if (error instanceof z.ZodError) return 'Dữ liệu cấu hình thành viên từ máy chủ không hợp lệ.'
  return error instanceof Error ? error.message : 'Không thể lưu cấu hình thành viên.'
}
