import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getActivityLogs } from '../api/activityApi'
import type { ActivityLog } from '../types/types'
import type { ActivityFilterValues } from '../schemas/activityFilterSchema'
const pageSize = PAGE_SIZE
export function useActivity() {
  const [filters, setFilters] = useState<ActivityFilterValues>({
    userId: '',
    search: '',
    action: '',
    from: '',
    to: '',
  })
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<ActivityLog | null>(null)
  const params = {
    page,
    pageSize,
    userId: filters.userId || undefined,
    search: filters.search || undefined,
    action: filters.action || undefined,
    from: filters.from
      ? new Date(filters.from + 'T00:00:00').toISOString()
      : undefined,
    to: filters.to
      ? new Date(filters.to + 'T23:59:59.999').toISOString()
      : undefined,
  }
  const logs = useQuery({
    queryKey: ['activity-logs', params],
    queryFn: ({ signal }) => getActivityLogs(params, signal),
    placeholderData: keepPreviousData,
  })
  const total = logs.data?.totalCount ?? 0
  {
    if (logs.isSuccess && !logs.isPlaceholderData) {
      const lastPage = Math.max(1, Math.ceil(logs.data.totalCount / pageSize))
      if (page > lastPage) setPage(lastPage)
    }
  }
  function filter(value: ActivityFilterValues) {
    setFilters(value)
    setPage(1)
  }
  function changePage(value: number) {
    setPage(value)
  }
  return {
    logs,
    total,
    page,
    pageSize,
    filters,
    filterUser: (id: string) => {
      setFilters((previous) => ({ ...previous, userId: id }))
      setPage(1)
    },
    filter,
    changePage,
    detail,
    setDetail,
  }
}
