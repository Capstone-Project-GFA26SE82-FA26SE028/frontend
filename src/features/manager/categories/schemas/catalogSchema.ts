import { z } from 'zod'

export const categorySchema = z.object({
  categoryId: z.string(),
  categoryCode: z.string(),
  categoryName: z.string(),
  isActive: z.boolean(),
})
export const itemSchema = z.object({
  itemId: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  itemCode: z.string(),
  itemName: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  availability: z.enum(['Available', 'OutOfStock', 'Inactive']),
  version: z.string(),
})
export const priceSchema = z.object({
  priceId: z.string(),
  itemId: z.string(),
  channel: z.string(),
  amount: z.number(),
  effectiveFrom: z.string(),
  effectiveTo: z.string().nullable(),
  dailyStart: z.string().nullable(),
  dailyEnd: z.string().nullable(),
})
