import { z } from 'zod'

export const notificationSchema = z
  .object({
    id: z.string().or(z.number().transform(String)),
    restaurantId: z.string().nullish(),
    type: z.string().default(''),
    title: z.string().default(''),
    message: z.string().default(''),
    entityType: z.string().default(''),
    entityId: z.string().nullish(),
    createdAt: z.string().default(''),
    readAt: z.string().nullish(),
  })
  .passthrough()

export const notificationPageSchema = z.preprocess(
  (val: unknown) => {
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
      return {
        items: obj.items ?? obj.Items ?? [],
        totalCount: obj.totalCount ?? obj.TotalCount ?? 0,
        page: obj.page ?? obj.Page ?? 1,
        pageSize: obj.pageSize ?? obj.PageSize ?? 20,
      }
    }
    return val
  },
  z.object({
    items: z.array(notificationSchema).default([]),
    totalCount: z.number().int().nonnegative().default(0),
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(20),
  }),
)

export const notificationDetailSchema = z.preprocess(
  (val: unknown) => {
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
      return {
        notification: obj.notification ?? obj.Notification ?? obj,
      }
    }
    return val
  },
  z.object({
    notification: notificationSchema,
  }),
)

export const unreadCountSchema = z.preprocess(
  (val: unknown) => {
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
      return {
        count: obj.count ?? obj.Count ?? 0,
      }
    }
    return val
  },
  z.object({
    count: z.number().int().nonnegative().default(0),
  }),
)

export const notificationEnvelopeSchema = z.object({
  isSuccess: z.boolean().optional(),
  message: z.string().nullish(),
  result: z.unknown().optional(),
})

