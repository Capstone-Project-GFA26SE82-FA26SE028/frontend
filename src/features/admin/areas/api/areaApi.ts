import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { Area, AreaQuery } from '../types'
import type { AreaValues } from '../schemas/areaSchema'
const area: z.ZodType<Area> = z.object({
  areaId: z.string(),
  restaurantId: z.string(),
  areaCode: z.string(),
  areaName: z.string(),
  serviceType: z.string(),
  spaceType: z.string(),
  isActive: z.boolean(),
})
function result<T>(data: unknown, schema: z.ZodType<T>) {
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Unable to complete the request.')
  return schema.parse(envelope.result)
}
export async function getAreas(params: AreaQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get('/areas', { params, signal })
  return result(
    data,
    z.object({
      items: z.array(area),
      totalCount: z.number().nonnegative(),
      page: z.number(),
      pageSize: z.number(),
    }),
  )
}
export async function getArea(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get('/areas/' + encodeURIComponent(id), {
    signal,
  })
  return result(data, area)
}
export async function saveArea(values: AreaValues, id?: string) {
  const { data } = id
    ? await axiosClient.put('/areas/' + encodeURIComponent(id), values)
    : await axiosClient.post('/areas', values)
  return result(data, area)
}
export async function setAreaStatus(id: string, isActive: boolean) {
  const { data } = await axiosClient.patch(
    '/areas/' + encodeURIComponent(id) + '/status',
    { isActive },
  )
  return result(data, area)
}
export async function deleteArea(id: string) {
  const { data } = await axiosClient.delete('/areas/' + encodeURIComponent(id))
  result(data, z.unknown())
}
export function areaError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to connect to the server.'
    if (error.response.status >= 500)
      return 'The area service is temporarily unavailable.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to complete the request.'
  }
  return error instanceof z.ZodError
    ? 'The server returned an unexpected response.'
    : error instanceof Error
      ? error.message
      : 'Unable to complete the request.'
}
