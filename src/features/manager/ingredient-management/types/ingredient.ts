import type { z } from 'zod'
import type {
  ingredientSchema,
  unitSchema,
  conversionSchema,
  recipeSchema,
} from '../schemas/ingredientSchema'

export type Ingredient = z.infer<typeof ingredientSchema>
export type Unit = z.infer<typeof unitSchema>
export type Conversion = z.infer<typeof conversionSchema>
export type Recipe = z.infer<typeof recipeSchema>
export type RecipeLine = {
  key: string
  ingredientRef: string
  unitRef: string
  quantity: string
}
export type RecipeWrite = {
  effectiveFrom: string
  instructions: string
  ingredients: { ingredientRef: string; unitRef: string; quantity: number }[]
  media: Recipe['media']
}
