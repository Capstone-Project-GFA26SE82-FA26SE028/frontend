import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getActivityLogs, getActivityUser } from '../api/activityApi'
import type { ActivityLog } from '../types/types'
const pageSize = PAGE_SIZE
export function useActivity() {
  const [userId, setUserId] = useState('')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<ActivityLog | null>(null)
  const logs = useQuery({
    queryKey: ['activity-logs', { page, pageSize, userId }],
    queryFn: ({ signal }) =>
      getActivityLogs({ page, pageSize, userId: userId || undefined }, signal),
    placeholderData: keepPreviousData,
  })
  const total = logs.data?.totalCount ?? 0
  {
    if (logs.isSuccess && !logs.isPlaceholderData) {
      const lastPage = Math.max(1, Math.ceil(logs.data.totalCount / pageSize))
      if (page > lastPage) setPage(lastPage)
    }
  }
  function filter(value: string) {
    setUserId(value)
    setPage(1)
  }
  function changePage(value: number) {
    setPage(value)
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }
  return {
    logs,
    total,
    page,
    pageSize,
    userId,
    filter,
    changePage,
    detail,
    setDetail,
  }
}

export function useActivityUser(id: string | null) {
  return useQuery({
    queryKey: ['users', 'activity-user', id],
    queryFn: ({ signal }) => getActivityUser(id!, signal),
    enabled: !!id,
    staleTime: 60_000,
  })
}
