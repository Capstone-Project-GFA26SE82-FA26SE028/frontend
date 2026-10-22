import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { Restaurant, RestaurantQuery } from '../types'
import type { RestaurantValues } from '../schemas/restaurantSchema'
const schema: z.ZodType<Restaurant> = z.object({
  restaurantId: z.string(),
  restaurantName: z.string(),
  address: z.string(),
  hotline: z.string(),
  taxCode: z.string().nullable(),
  logoUrl: z.string().nullable(),
  timeZone: z.string(),
  openingHours: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      openAt: z.string(),
      closeAt: z.string(),
    }),
  ),
})
function result<T>(data: unknown, shape: z.ZodType<T>): T {
  const envelope = z
    .object({ isSuccess: z.boolean(), result: z.unknown() })
    .parse(data)
  if (!envelope.isSuccess) throw new Error('Unable to complete the request.')
  return shape.parse(envelope.result)
}
export async function getRestaurants(
  params: RestaurantQuery,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get('/restaurants', { params, signal })
  return result(
    data,
    z.object({
      items: z.array(schema),
      totalCount: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    }),
  )
}
export async function getRestaurant(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get(
    '/restaurants/' + encodeURIComponent(id),
    { signal },
  )
  return result(data, schema)
}
export async function saveRestaurant(values: RestaurantValues, id?: string) {
  const body = {
    ...values,
    taxCode: values.taxCode || null,
    logoUrl: values.logoUrl || null,
  }
  const { data } = id
    ? await axiosClient.put('/restaurants/' + encodeURIComponent(id), body)
    : await axiosClient.post('/restaurants', body)
  return result(data, schema)
}
export function restaurantError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Unable to connect to the server. Please try again.'
    if (status >= 500)
      return 'The restaurant service is temporarily unavailable.'
    if (status === 401) return 'Your session has expired.'
    if (status === 403)
      return 'You do not have permission to manage restaurants.'
    if (status === 404)
      return 'This restaurant no longer exists. Refresh the list.'
    if (status === 429) return 'Too many requests. Please try again shortly.'
    return typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to save. Check the details and try again.'
  }
  if (error instanceof z.ZodError)
    return 'The server returned an unexpected response.'
  return error instanceof Error
    ? error.message
    : 'Unable to complete the request.'
}
