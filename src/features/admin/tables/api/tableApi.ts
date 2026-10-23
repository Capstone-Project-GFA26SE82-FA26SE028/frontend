import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { Table } from '../types'
import type { TableValues } from '../schemas/tableSchema'
const schema: z.ZodType<Table> = z.object({
  tableId: z.string(),
  areaId: z.string(),
  tableCode: z.string(),
  capacity: z.number(),
  positionX: z.number().nullable(),
  positionY: z.number().nullable(),
  version: z.string(),
  isActive: z.boolean(),
  cleaningStatus: z.string(),
})
function result<T>(data: unknown, shape: z.ZodType<T>) {
  const e = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!e.isSuccess) throw new Error(e.message || 'Request failed.')
  return shape.parse(e.result)
}
export async function getTables(
  params: {
    page: number
    pageSize: number
    search?: string
    restaurantId?: string
    areaId?: string
    isActive?: boolean
  },
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get('/tables', { params, signal })
  return result(
    data,
    z.object({
      items: z.array(schema),
      totalCount: z.number(),
      page: z.number(),
      pageSize: z.number(),
    }),
  )
}
export async function getTable(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get('/tables/' + encodeURIComponent(id), {
    signal,
  })
  return result(data, schema)
}
export type TableAction =
  | { kind: 'save'; values: TableValues; id?: string }
  | { kind: 'move'; id: string; areaId: string; version: string }
  | { kind: 'status'; id: string; isActive: boolean; version: string }
  | { kind: 'delete'; id: string; version: string }
export async function updateTable(a: TableAction) {
  if (a.kind === 'save') {
    const { data } = a.id
      ? await axiosClient.put('/tables/' + encodeURIComponent(a.id), a.values)
      : await axiosClient.post('/tables', a.values)
    return result(data, schema)
  }
  const url = '/tables/' + encodeURIComponent(a.id)
  if (a.kind === 'delete') {
    const { data } = await axiosClient.delete(url, {
      params: { version: a.version },
    })
    result(data, z.unknown())
    return null
  }
  const { data } =
    a.kind === 'move'
      ? await axiosClient.patch(url + '/area', {
          areaId: a.areaId,
          version: a.version,
        })
      : await axiosClient.patch(url + '/status', {
          isActive: a.isActive,
          version: a.version,
        })
  return result(data, schema)
}
export function tableError(e: unknown) {
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'Unable to connect to the server.'
    if (e.response.status >= 500)
      return 'The table service is temporarily unavailable.'
    return typeof e.response.data?.message === 'string'
      ? e.response.data.message
      : 'Unable to complete the request.'
  }
  return e instanceof z.ZodError
    ? 'Unexpected server response.'
    : e instanceof Error
      ? e.message
      : 'Unable to complete the request.'
}
export function isTableVersionConflict(e: unknown) {
  if (!axios.isAxiosError(e) || e.response?.status !== 409) return false
  return [
    'The table has changed. Reload the data.',
    'The data has changed. Reload before continuing.',
    'A concurrent operation was detected. Reload and try again.',
  ].includes(e.response.data?.message)
}
