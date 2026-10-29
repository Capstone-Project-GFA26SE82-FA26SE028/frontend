import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { TableQr, TableResponse, TableQrPage } from '../types/types'
function result<T>(e: TableResponse<T>): T {
  if (!e.isSuccess) throw new Error(e.message || 'Không thể tải mã QR.')
  return e.result
}
export async function getCurrentQr(
  tableId: string,
  tableCode: string,
  signal?: AbortSignal,
) {
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<TableResponse<TableQrPage>>('/qr', {
      params: { search: tableCode, isActive: true, page, pageSize: 100 },
      signal,
    })
    const list = result(data)
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
    ? await axiosClient.post<TableResponse<{ qr: TableQr }>>(
        path + '/regenerate',
        { expectedQrId },
      )
    : await axiosClient.post<TableResponse<{ qr: TableQr }>>(path)
  return result(data).qr
}
export async function getQrImage(qrId: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<Blob>(
    '/qr/' + encodeURIComponent(qrId) + '/image',
    { responseType: 'blob', headers: { Accept: 'image/png' }, signal },
  )
  if (!data.type.toLowerCase().startsWith('image/png'))
    throw new Error('Máy chủ không trả về ảnh PNG.')
  return data
}
export function qrError(e: unknown) {
  if (axios.isAxiosError(e)) {
    if (!e.response)
      return 'Không kết nối được máy chủ. Vui lòng tải lại mã QR trước khi thử lại.'
    if (e.response.status >= 500)
      return 'Dịch vụ QR đang gián đoạn. Vui lòng tải lại mã QR trước khi thử lại.'
    return typeof e.response.data?.message === 'string'
      ? e.response.data.message
      : 'Không thể tải mã QR hoặc hình ảnh.'
  }
  return e instanceof Error ? e.message : 'Không thể hoàn tất yêu cầu QR.'
}
