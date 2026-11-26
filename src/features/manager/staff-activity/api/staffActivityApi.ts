import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'

const activity = z.object({
  activityId: z.string(),
  timestamp: z.string(),
  activityType: z.string(),
  staffName: z.string().nullish(),
  staffRole: z.string().nullish(),
  target: z.string(),
  actionDescription: z.string(),
  reason: z.string().nullish(),
  metadata: z.record(z.string(), z.string()).nullish(),
})
const resultSchema = z.object({
  items: z.array(activity),
  totalCount: z.number().int().nonnegative(),
})
export type LiveStaffActivity = z.infer<typeof activity>
export type ActivityFilters = {
  page: number
  pageSize: number
  search?: string
  activityType?: string
  from?: string
  to?: string
}

export async function getStaffActivity(
  restaurantId: string,
  params: ActivityFilters,
  signal: AbortSignal,
) {
  const { data } = await axiosClient.get(
    `/restaurants/${restaurantId}/staff-activities`,
    { params, signal },
  )
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().nullish(),
      result: z.unknown(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể tải hoạt động nhân viên.')
  return resultSchema.parse(envelope.result)
}
