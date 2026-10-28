import { useCallback, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { kdsApi, kdsError, kdsReadPolicy, kdsPollInterval } from '../api/kdsApi'
import type { KdsContextValue } from '../context/KdsContext'
import type { KdsCommand, KdsState } from '../types'
import { mapKdsState } from '../utils/mapKdsState'

export function useKdsData(): KdsContextValue {
  const user = useAppSelector((s) => s.auth.session?.user)
  const client = useQueryClient()
  const [selectedStation, setStationId] = useState('')
  const [feedback, setFeedback] = useState<KdsState['feedback']>(null)
  const dismissFeedback = useCallback(() => setFeedback(null), [])
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  const key = ['kitchen-live', user?.userId]
  const stations = useQuery({
    ...kdsReadPolicy,
    queryKey: [...key, 'stations'],
    queryFn: ({ signal }) => kdsApi.stations(signal),
    staleTime: 30000,
  })
  const tasks = useQuery({
    ...kdsReadPolicy,
    queryKey: [...key, 'tasks'],
    queryFn: ({ signal }) => kdsApi.allTasks(signal),
    refetchInterval: kdsPollInterval(5000),
  })
  const items = useQuery({
    ...kdsReadPolicy,
    queryKey: [...key, 'items'],
    queryFn: ({ signal }) => kdsApi.items(signal),
    staleTime: 30000,
    refetchInterval: kdsPollInterval(30000),
  })
  const stationId = stations.data?.some(
    (s) => s.kitchenStationId === selectedStation,
  )
    ? selectedStation
    : stations.data?.[0]?.kitchenStationId || ''
  const area =
    stations.data?.find((s) => s.kitchenStationId === stationId)
      ?.kitchenStationName || 'Kitchen'
  const stationTasks = (tasks.data || []).filter(
    (t) => t.kitchenStationId === stationId,
  )
  const stationItems = (items.data || []).filter(
    (i) =>
      i.kitchenStationId === stationId ||
      stationTasks.some((t) => t.itemId === i.itemId),
  )
  const state = mapKdsState({
    signedIn: !!user,
    area,
    tasks: stationTasks,
    items: stationItems,
    feedback,
  })
  const refresh = () => {
    void client.invalidateQueries({ queryKey: key })
  }
  const run = async (command: KdsCommand): Promise<boolean> => {
    if (busy.current) return false
    busy.current = true
    setPending(true)
    setFeedback(null)
    try {
      if (command.type === 'transition') {
        const task = stationTasks.find((t) => t.kitchenTaskId === command.id)
        if (!task || !task.version)
          throw new Error('Reload this dish before updating it.')
        await kdsApi.update(task, 'status', command.status)
      } else {
        throw new Error(
          'This operation is not available through the current Kitchen API.',
        )
      }
      // Cancel older polling responses before fetching the committed server state.
      await client.cancelQueries({ queryKey: key })
      await client.invalidateQueries({ queryKey: key })
      setFeedback({ error: false, text: 'Updated successfully.' })
      return true
    } catch (error) {
      setFeedback({ error: true, text: kdsError(error) })
      refresh()
      return false
    } finally {
      busy.current = false
      setPending(false)
    }
  }
  const errors = [
    stations.isError && `Stations: ${kdsError(stations.error)}`,
    tasks.isError && `Orders: ${kdsError(tasks.error)}`,
    items.isError && `Menu: ${kdsError(items.error)}`,
  ].filter((error): error is string => typeof error === 'string')
  return {
    state,
    tickets: state.tickets,
    run,
    pending,
    loading: stations.isLoading || tasks.isLoading || items.isLoading,
    errors,
    refresh,
    dismissFeedback,
    stations: stations.data || [],
    stationId,
    setStationId,
  }
}
