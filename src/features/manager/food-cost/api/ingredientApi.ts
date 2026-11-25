import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import {
  conversionSchema,
  recipeSchema,
  unitSchema,
} from '../schemas/ingredientSchema'

async function getResult<T>(
  url: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get(url, { signal })
  const response = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!response.isSuccess)
    throw new Error(response.message || 'Unable to load data.')
  return schema.parse(response.result)
}

export const getUnits = (signal?: AbortSignal) =>
  getResult('/units', z.array(unitSchema), signal)
export const getConversions = (ingredientId: string, signal?: AbortSignal) =>
  getResult(
    `/ingredients/${ingredientId}/units`,
    z.array(conversionSchema),
    signal,
  )
export const getRecipes = (itemId: string, signal?: AbortSignal) =>
  getResult(`/items/${itemId}/recipes`, z.array(recipeSchema), signal)
