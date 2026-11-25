import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  getStations,
  getStationChoices,
  getStationItems,
  writeStation,
  kitchenStationError,
} from '../api/kitchenStationApi'
import { STATION_KEY } from '../constants/kitchenStation'
export function useKitchenStations(
  search: string,
  status: string,
  page: number,
) {
  return useQuery({
    queryKey: [...STATION_KEY, search, status, page],
    queryFn: ({ signal }) => getStations(search, status, page, signal),
  })
}
export function useStationChoices() {
  return useQuery({
    queryKey: [...STATION_KEY, 'choices'],
    queryFn: ({ signal }) => getStationChoices(signal),
  })
}
export function useStationItems() {
  return useQuery({
    queryKey: [...STATION_KEY, 'items'],
    queryFn: ({ signal }) => getStationItems(signal),
  })
}
export function useStationMutation(onSuccess?: () => void) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: writeStation,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: STATION_KEY }),
        client.invalidateQueries({ queryKey: ['manager-catalog'] }),
      ])
      toast.success('Đã lưu thay đổi.')
      onSuccess?.()
    },
    onError: async (error) => {
      toast.error(kitchenStationError(error))
      await client.invalidateQueries({ queryKey: STATION_KEY })
    },
  })
}
