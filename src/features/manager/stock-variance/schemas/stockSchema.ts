import { z } from 'zod'

export const movementSchema = z.object({
  stockMovementId: z.string(),
  ingredientId: z.string(),
  movementType: z.string(),
  quantityChange: z.number(),
  performedByRef: z.string().nullable(),
  reason: z.string().nullable(),
  createdAt: z.string(),
})

export const lotSchema = z.object({
  goodsReceiptItemId: z.string(),
  ingredientId: z.string(),
  receivedAt: z.string(),
  expiryDate: z.string().nullable(),
  receivedQuantity: z.number(),
  remainingQuantity: z.number(),
  expiryStatus: z.string(),
  canIssue: z.boolean(),
})
