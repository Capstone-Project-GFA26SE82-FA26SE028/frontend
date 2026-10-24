import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  previewActivity,
  previewKitchen,
  previewTables,
} from '../data/previewOperations'

export function useOperationsTables() {
  return useQuery({
    queryKey: ['manager-operations-preview', 'tables'],
    queryFn: async () => previewTables(),
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })
}
export function useKitchenTasks() {
  return useQuery({
    queryKey: ['manager-operations-preview', 'kitchen'],
    queryFn: async () => previewKitchen(Date.now()),
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })
}
export function useStaffActivity() {
  return useQuery({
    queryKey: ['manager-operations-preview', 'activity'],
    queryFn: async () => previewActivity(Date.now()),
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })
}
export function useMonitoringClock() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}
