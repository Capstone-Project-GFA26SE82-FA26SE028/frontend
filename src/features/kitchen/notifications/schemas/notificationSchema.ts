import { z } from 'zod'

export const notificationSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  readAt: z.string().datetime({ offset: true }).nullable(),
})
export const notificationPageSchema = z.object({
  items: z.array(notificationSchema),
  totalCount: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})
export const notificationDetailSchema = z.object({
  notification: notificationSchema,
})
export const unreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
})
export const notificationEnvelopeSchema = z.object({
  isSuccess: z.boolean(),
  message: z.string().nullish(),
  result: z.unknown().optional(),
})
