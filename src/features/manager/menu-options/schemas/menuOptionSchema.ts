import { z } from 'zod'
export const optionRowSchema = z.object({
  optionGroupId: z.string(),
  optionGroupName: z.string().optional(),
  optionId: z.string().optional(),
  optionName: z.string().optional(),
  extraPrice: z.number().optional(),
  availability: z.string().optional(),
  minSelection: z.number().optional(),
  maxSelection: z.number().optional(),
})
export const itemChoiceSchema = z.object({
  itemId: z.string(),
  itemName: z.string(),
})
