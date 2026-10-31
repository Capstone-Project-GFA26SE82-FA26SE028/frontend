import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  Table,
  TableResponse,
  TablePage,
  TableQuery,
} from '../types/types'
import type { TableValues } from '../schemas/tableSchema'
function result<T>(e: TableResponse<T>): T {
  if (!e.isSuccess) throw new Error(e.message || 'Yêu cầu không thành công.')
  return e.result
}
export async function getTables(params: TableQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get<TableResponse<TablePage>>('/tables', {
    params,
    signal,
  })
  return result(data)
}
// Tải đủ bàn cho sơ đồ theo khu vực; backend vẫn trả từng trang.
export async function getAllTables(
  params: Omit<TableQuery, 'page' | 'pageSize'>,
  signal?: AbortSignal,
) {
  const tables = new Map<string, Table>()
  for (let page = 1; ; page++) {
    const batch = await getTables({ ...params, page, pageSize: 100 }, signal)
    batch.items.forEach((table) => tables.set(table.tableId, table))
    if (batch.page * batch.pageSize >= batch.totalCount) {
      if (tables.size < batch.totalCount) {
        throw new Error('Chưa tải đủ danh sách bàn. Vui lòng thử lại.')
      }
      return { items: [...tables.values()], totalCount: tables.size }
    }
    if (!batch.items.length) {
      throw new Error('Chưa tải đủ danh sách bàn. Vui lòng thử lại.')
    }
  }
}

export async function getTable(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<TableResponse<Table>>(
    '/tables/' + encodeURIComponent(id),
    {
      signal,
    },
  )
  return result(data)
}
export type TableAction =
  | { kind: 'save'; values: TableValues; id?: string }
  | { kind: 'move'; id: string; areaId: string; version: string }
  | { kind: 'status'; id: string; isActive: boolean; version: string }
  | { kind: 'delete'; id: string; version: string }
export async function updateTable(a: TableAction) {
  if (a.kind === 'save') {
    const { data } = a.id
      ? await axiosClient.put<TableResponse<Table>>(
          '/tables/' + encodeURIComponent(a.id),
          a.values,
        )
      : await axiosClient.post<TableResponse<Table>>('/tables', a.values)
    return result(data)
  }
  const url = '/tables/' + encodeURIComponent(a.id)
  if (a.kind === 'delete') {
    const { data } = await axiosClient.delete<TableResponse<unknown>>(url, {
      params: { version: a.version },
    })
    result(data)
    return null
  }
  const { data } =
    a.kind === 'move'
      ? await axiosClient.patch<TableResponse<Table>>(url + '/area', {
          areaId: a.areaId,
          version: a.version,
        })
      : await axiosClient.patch<TableResponse<Table>>(url + '/status', {
          isActive: a.isActive,
          version: a.version,
        })
  return result(data)
}
export function tableError(e: unknown) {
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'Không kết nối được máy chủ.'
    if (e.response.status >= 500) return 'Dịch vụ bàn đang gián đoạn.'
    return typeof e.response.data?.message === 'string'
      ? e.response.data.message
      : 'Không thể hoàn tất yêu cầu.'
  }
  return e instanceof Error ? e.message : 'Không thể hoàn tất yêu cầu.'
}
export function isTableVersionConflict(e: unknown) {
  if (!axios.isAxiosError(e) || e.response?.status !== 409) return false
  return [
    'The table has changed. Reload the data.',
    'The data has changed. Reload before continuing.',
    'A concurrent operation was detected. Reload and try again.',
  ].includes(e.response.data?.message)
}
