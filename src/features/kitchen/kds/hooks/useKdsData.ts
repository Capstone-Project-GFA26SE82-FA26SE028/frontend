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
  const summary = useQuery({
    ...kdsReadPolicy,
    queryKey: [...key, 'summary', stationId],
    queryFn: ({ signal }) => kdsApi.summary(stationId, signal),
    enabled: !!stationId,
    refetchInterval: kdsPollInterval(5000),
  })
  const batches = useQuery({
    ...kdsReadPolicy,
    queryKey: [...key, 'batches', stationId],
    queryFn: ({ signal }) => kdsApi.batches(stationId, signal),
    enabled: !!stationId,
    refetchInterval: kdsPollInterval(5000),
  })
  const area =
    stations.data?.find((s) => s.kitchenStationId === stationId)
      ?.kitchenStationName || 'Bếp'
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
          throw new Error('Tải lại món này trước khi cập nhật.')
        await kdsApi.update(task, 'status', command.status)
      } else if (command.type === 'priority') {
        const task = stationTasks.find((t) => t.kitchenTaskId === command.id)
        if (!task?.version) throw new Error('Tải lại món trước khi cập nhật.')
        await kdsApi.update(task, 'priority', command.priority)
      } else if (command.type === 'batch') {
        const result = await kdsApi.batch(command.action, command.taskIds)
        if (!result.affectedCount)
          throw new Error('Không có món phù hợp. Vui lòng tải lại dữ liệu.')
      } else if (command.type === 'remake') {
        await kdsApi.remake(command.id, command.reason)
      } else if (command.type === 'fire') {
        const result = await kdsApi.fire(
          command.tableSessionId,
          command.orderId,
          command.course,
        )
        if (!result.activatedCount) throw new Error(result.message)
      } else if (command.type === 'availability') {
        const item = stationItems.find((i) => i.itemId === command.id)
        if (!item?.version)
          throw new Error('Tải lại thực đơn trước khi cập nhật.')
        await kdsApi.availability(item, command.availability)
      } else {
        throw new Error('API bếp hiện chưa hỗ trợ thao tác này.')
      }
      // Cancel older polling responses before fetching the committed server state.
      await client.cancelQueries({ queryKey: key })
      await client.invalidateQueries({ queryKey: key })
      setFeedback({ error: false, text: 'Đã cập nhật thành công.' })
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
    summary.isError && `Thống kê: ${kdsError(summary.error)}`,
    batches.isError && `Mẻ nấu: ${kdsError(batches.error)}`,
    stations.isError && `Stations: ${kdsError(stations.error)}`,
    tasks.isError && `Orders: ${kdsError(tasks.error)}`,
    items.isError && `Menu: ${kdsError(items.error)}`,
  ].filter((error): error is string => typeof error === 'string')
  return {
    tasks: stationTasks,
    items: stationItems,
    summary: summary.data,
    batches: batches.data || [],
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
