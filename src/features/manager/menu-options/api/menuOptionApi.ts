import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'

type Envelope<T> = { isSuccess: boolean; message?: string; result: T }

function unwrap<T>(data: Envelope<T>) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể xử lý tùy chọn.')
  return data.result
}
export async function listMenuOptions<T>(
  path: string,
  schema: z.ZodType<T>,
  signal: AbortSignal,
) {
  const rows: T[] = []
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<
      Envelope<T[] | { items: T[]; totalCount: number }>
    >(path, { params: { page, pageSize: 100 }, signal })
    const result = unwrap(data)
    if (Array.isArray(result)) return z.array(schema).parse(result)
    rows.push(...z.array(schema).parse(result.items))
    if (rows.length >= result.totalCount) return rows
    if (!result.items.length) throw new Error('Chưa tải đủ dữ liệu.')
  }
}
export async function writeMenuOption({
  method,
  url,
  body,
}: {
  method: 'post' | 'put' | 'delete' | 'patch'
  url: string
  body?: object
}) {
  const { data } = await axiosClient.request<Envelope<unknown>>({
    method,
    url,
    data: body,
  })
  unwrap(data)
}
