import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type { Area, AreaQuery, AreaResponse, AreaPage } from '../types/types'
import type { AreaValues } from '../schemas/areaSchema'
function result<T>(envelope: AreaResponse<T>): T {
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể hoàn tất yêu cầu.')
  return envelope.result
}
export async function getAreas(params: AreaQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get<AreaResponse<AreaPage>>('/areas', {
    params,
    signal,
  })
  return result(data)
}
export async function getAllAreas(restaurantId: string, signal?: AbortSignal) {
  const areas = new Map<string, Area>()
  for (let page = 1; ; page++) {
    const batch = await getAreas({ restaurantId, page, pageSize: 100 }, signal)
    batch.items.forEach((area) => areas.set(area.areaId, area))
    if (
      batch.page * batch.pageSize >= batch.totalCount &&
      areas.size >= batch.totalCount
    )
      return [...areas.values()]
    if (!batch.items.length || batch.page * batch.pageSize >= batch.totalCount)
      throw new Error('Chưa tải đủ danh sách khu vực. Vui lòng thử lại.')
  }
}

export async function getArea(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<AreaResponse<Area>>(
    '/areas/' + encodeURIComponent(id),
    {
      signal,
    },
  )
  return result(data)
}
export async function saveArea(values: AreaValues, id?: string) {
  const { data } = id
    ? await axiosClient.put<AreaResponse<Area>>(
        '/areas/' + encodeURIComponent(id),
        values,
      )
    : await axiosClient.post<AreaResponse<Area>>('/areas', values)
  return result(data)
}
export async function setAreaStatus(id: string, isActive: boolean) {
  const { data } = await axiosClient.patch<AreaResponse<Area>>(
    '/areas/' + encodeURIComponent(id) + '/status',
    { isActive },
  )
  return result(data)
}
export async function deleteArea(id: string) {
  const { data } = await axiosClient.delete<AreaResponse<unknown>>(
    '/areas/' + encodeURIComponent(id),
  )
  result(data)
}
export function areaError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'
    if (error.response.status >= 500) return 'Dịch vụ khu vực đang gián đoạn.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể hoàn tất yêu cầu.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
