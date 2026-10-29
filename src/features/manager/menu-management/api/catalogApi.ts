import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { Page } from '../types/catalog'

function result<T>(data: unknown, schema: z.ZodType<T>): T {
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown().optional(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể hoàn tất thao tác.')
  return schema.parse(envelope.result)
}
export async function getPage<T>(
  path: string,
  schema: z.ZodType<T>,
  params: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<Page<T>> {
  const { data } = await axiosClient.get(path, { params, signal })
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
export async function getChoices<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T[]> {
  const first = await getPage(path, schema, { page: 1, pageSize: 100 }, signal)
  const items = [...first.items]
  for (let page = 2; page <= Math.ceil(first.totalCount / 100); page++) {
    items.push(
      ...(await getPage(path, schema, { page, pageSize: 100 }, signal)).items,
    )
  }
  return items
}
export async function writeCatalog(
  method: 'post' | 'put' | 'patch' | 'delete',
  path: string,
  body?: unknown,
) {
  const { data } = await axiosClient.request({ method, url: path, data: body })
  result(data, z.unknown())
}

export async function uploadItemImage(file: File, signal?: AbortSignal) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await axiosClient.post('/items/images', form, { signal })
  return result(data, z.object({ imageUrl: z.string().url() })).imageUrl
}
export async function appliedPrice(
  itemId: string,
  channel: string,
  at: string,
) {
  const { data } = await axiosClient.get(`/items/${itemId}/price`, {
    params: { channel, at },
  })
  return result(
    data,
    z.object({
      amount: z.number(),
      priceChannel: z.string(),
      hasValidStandardPrice: z.boolean(),
    }),
  )
}
export function catalogError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (error.response.status === 403)
      return 'Tài khoản của bạn không có quyền thực hiện thao tác này.'
    return (
      error.response.data?.message ||
      'Không thể hoàn tất yêu cầu. Vui lòng tải lại và thử lại.'
    )
  }
  return error instanceof z.ZodError
    ? 'Dữ liệu máy chủ trả về không hợp lệ.'
    : error instanceof Error
      ? error.message
      : 'Đã xảy ra lỗi. Vui lòng thử lại.'
}
