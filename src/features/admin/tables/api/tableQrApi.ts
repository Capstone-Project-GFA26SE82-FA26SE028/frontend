import { z } from 'zod'
import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { TableQr } from '../types'
const qr: z.ZodType<TableQr> = z.object({
  qrId: z.string(),
  tableId: z.string(),
  tableCode: z.string(),
  areaId: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  revokedAt: z.string().nullable(),
  isUsable: z.boolean(),
})
function result<T>(data: unknown, schema: z.ZodType<T>) {
  const e = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!e.isSuccess) throw new Error(e.message || 'Unable to load QR code.')
  return schema.parse(e.result)
}
export async function getCurrentQr(
  tableId: string,
  tableCode: string,
  signal?: AbortSignal,
) {
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get('/qr', {
      params: { search: tableCode, isActive: true, page, pageSize: 100 },
      signal,
    })
    const list = result(
      data,
      z.object({ items: z.array(qr), totalCount: z.number() }),
    )
    const current = list.items.find(
      (q) => q.tableId === tableId && q.revokedAt === null,
    )
    if (current) return current
    if (!list.items.length || page * 100 >= list.totalCount) return null
  }
}
export async function issueTableQr(tableId: string, expectedQrId?: string) {
  const path = '/qr/tables/' + encodeURIComponent(tableId)
  const { data } = expectedQrId
    ? await axiosClient.post(path + '/regenerate', { expectedQrId })
    : await axiosClient.post(path)
  return result(data, z.object({ qr })).qr
}
export async function getQrImage(qrId: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<Blob>(
    '/qr/' + encodeURIComponent(qrId) + '/image',
    { responseType: 'blob', headers: { Accept: 'image/png' }, signal },
  )
  if (!data.type.toLowerCase().startsWith('image/png'))
    throw new Error('The server did not return a PNG image.')
  return data
}
export function qrError(e: unknown) {
  if (axios.isAxiosError(e)) {
    if (!e.response)
      return 'Unable to connect to the server. Reload the QR before trying again.'
    if (e.response.status >= 500)
      return 'QR service unavailable. Reload the QR before trying again.'
    return typeof e.response.data?.message === 'string'
      ? e.response.data.message
      : 'Unable to load the QR code or image.'
  }
  return e instanceof z.ZodError
    ? 'Unexpected QR response. Reload before trying again.'
    : e instanceof Error
      ? e.message
      : 'Unable to complete the QR request.'
}
