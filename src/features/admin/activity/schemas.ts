import { z } from 'zod'
export const activityStorageSchema = z.array(
  z.object({
    id: z.string(),
    time: z.string(),
    actor: z.string().optional(),
    action: z.string(),
    target: z.string(),
    targetId: z.string().optional(),
    entity: z
      .enum([
        'restaurant',
        'user',
        'application',
        'plan',
        'coupon',
        'payment',
        'verification',
        'settings',
      ])
      .optional(),
    reason: z.string(),
  }),
)
