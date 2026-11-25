import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import { areaSchema, tableSchema } from '../schemas/tableSchema'
import type { TableFilters } from '../types/table'
async function getAll<T>(url: string, schema: z.ZodType<T>, params: Record<string, unknown>, signal?: AbortSignal) {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get(url, { params: { ...params, page, pageSize: 100 }, signal })
    const envelope = z.object({ isSuccess: z.boolean(), message: z.string().nullish(), result: z.unknown() }).parse(data)
    if (!envelope.isSuccess) throw new Error(envelope.message || 'Không thể tải dữ liệu bàn.')
    const batch = z.object({ items: z.array(schema), totalCount: z.number().int().nonnegative(), page: z.number().int().positive(), pageSize: z.number().int().positive() }).parse(envelope.result)
    items.push(...batch.items)
    if (items.length >= batch.totalCount) return items
    if (!batch.items.length || batch.page !== page || batch.page * batch.pageSize >= batch.totalCount)
      throw new Error('Chưa tải đủ dữ liệu. Vui lòng tải lại.')
  }
}
export function getTables(restaurantId: string, filters: TableFilters, signal?: AbortSignal) {
  return getAll('/tables', tableSchema, {
    restaurantId, search: filters.search || undefined, areaId: filters.areaId || undefined,
    isActive: filters.status === '' ? undefined : filters.status === 'true',
  }, signal)
}
export function getAreas(restaurantId: string, signal?: AbortSignal) {
  return getAll('/areas', areaSchema, { restaurantId }, signal)
}
