import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import {
  kitchenTaskSchema,
  summarySchema,
  tableSchema,
} from '../schemas/operationsSchema'
async function getResult<T>(
  path: string,
  schema: z.ZodType<T>,
  params: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get(path, { params, signal })
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().nullish(),
      result: z.unknown(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể tải dữ liệu bếp.')
  return schema.parse(envelope.result)
}
async function getAll<T>(
  path: string,
  schema: z.ZodType<T>,
  params: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const batch = await getResult(
      path,
      z.object({
        items: z.array(schema),
        totalCount: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
      }),
      { ...params, page, pageSize: 100 },
      signal,
    )
    items.push(...batch.items)
    if (items.length >= batch.totalCount) return items
    if (
      !batch.items.length ||
      batch.page !== page ||
      batch.page * batch.pageSize >= batch.totalCount
    )
      throw new Error('Chưa tải đủ dữ liệu bếp. Vui lòng làm mới.')
  }
}
export const getKitchenTasks = (signal?: AbortSignal) =>
  getAll('/kitchen-tasks', kitchenTaskSchema, { status: 'all' }, signal)
export const getKitchenTables = (restaurantId: string, signal?: AbortSignal) =>
  getAll('/tables', tableSchema, { restaurantId }, signal)
export const getKitchenSummary = (signal?: AbortSignal) =>
  getResult('/kitchen-tasks/summary', summarySchema, {}, signal)
export function kitchenAccessDenied(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    [401, 403].includes(error.response?.status || 0)
  )
}
export function kitchenError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (error.response.status === 403)
      return 'Bạn không có quyền xem tiến độ bếp của nhà hàng này.'
    if (error.response.status === 401)
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể tải dữ liệu bếp.'
  }
  if (error instanceof z.ZodError)
    return 'Dữ liệu bếp trả về không hợp lệ. Vui lòng làm mới.'
  return error instanceof Error ? error.message : 'Không thể tải dữ liệu bếp.'
}
