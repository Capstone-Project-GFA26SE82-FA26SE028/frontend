import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import { getPage, getChoices, writeCatalog } from '../../dishes/api/catalogApi'
import {
  kitchenStationSchema,
  stationItemSchema,
} from '../schemas/kitchenStationSchema'
import type { StationAction } from '../types/kitchenStation'
export { catalogError as kitchenStationError } from '../../dishes/api/catalogApi'
export const getStations = (
  search: string,
  status: string,
  page: number,
  signal?: AbortSignal,
) =>
  getPage(
    '/kitchen-stations',
    kitchenStationSchema,
    {
      search: search || undefined,
      isActive: status || undefined,
      page,
      pageSize: 10,
    },
    signal,
  )
export const getStationChoices = (signal?: AbortSignal) =>
  getChoices('/kitchen-stations', kitchenStationSchema, signal)
export const getStationItems = (signal?: AbortSignal) =>
  getChoices('/items', stationItemSchema, signal)
export async function getStation(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get(`/kitchen-stations/${id}`, { signal })
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể tải trạm bếp.')
  return kitchenStationSchema.parse(envelope.result)
}
export function writeStation(action: StationAction) {
  if (action.kind === 'assign')
    return writeCatalog(
      'patch',
      `/items/${action.item.itemId}/kitchen-station`,
      { kitchenStationId: action.stationId, version: action.item.version },
    )
  if (action.kind === 'status')
    return writeCatalog('patch', `/kitchen-stations/${action.id}/status`, {
      isActive: action.isActive,
    })
  return writeCatalog(
    action.id ? 'put' : 'post',
    action.id ? `/kitchen-stations/${action.id}` : '/kitchen-stations',
    action.body,
  )
}
