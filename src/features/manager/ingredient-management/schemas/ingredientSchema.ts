import { z } from 'zod'

export const ingredientSchema = z.object({
  ingredientId: z.string(),
  ingredientCode: z.string(),
  ingredientName: z.string(),
  baseUnit: z.string(),
  stockQuantity: z.number(),
  lowStockThreshold: z.number(),
  isActive: z.boolean(),
  isLowStock: z.boolean(),
})

export const unitSchema = z.object({
  unitId: z.string(),
  code: z.string(),
  name: z.string(),
})

export const conversionSchema = z.object({
  ingredientId: z.string(),
  unitId: z.string(),
  conversionFactor: z.number().positive(),
})

export const recipeSchema = z.object({
  recipeVersionId: z.string(),
  version: z.number(),
  effectiveFrom: z.string(),
  effectiveTo: z.string().nullable(),
  instructions: z.string().nullable(),
  ingredients: z.array(
    z.object({
      ingredientRef: z.string(),
      unitRef: z.string(),
      quantity: z.number(),
      baseQuantitySnapshot: z.number(),
      conversionFactorSnapshot: z.number(),
    }),
  ),
  media: z.array(
    z.object({
      mediaType: z.string(),
      url: z.string(),
      displayOrder: z.number(),
    }),
  ),
})
