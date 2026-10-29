import { useEffect, useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import { clearSession } from '../../../auth/api/authApi'
import {
  getSessions,
  getSessionRoles,
  revokeSession,
  sessionApiError,
} from '../api/sessionApi'
import {
  sessionStatus,
  type LoginSession,
  type SessionStatus,
} from '../types/types'

const pageSize = 10
export function useSessions() {
  const auth = useAppSelector((state) => state.auth.session)
  const actorId = auth?.user.userId
  const client = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<SessionStatus | ''>('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [device, setDevice] = useState('')
  const [mine, setMine] = useState(false)
  const [pagination, setPagination] = useState({ filter: '', page: 1 })
  const [target, setTarget] = useState<LoginSession | 'all' | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      300,
    )
    return () => window.clearTimeout(timer)
  }, [search])
  // The selected day is local to the browser; the API expects inclusive UTC bounds.
  const from = date ? new Date(date + 'T00:00:00') : undefined
  const to = date ? new Date(date + 'T23:59:59.999') : undefined
  const filters = {
    search: debouncedSearch || undefined,
    roleId: role || undefined,
    userId: mine ? actorId : undefined,
    deviceType: device || undefined,
    fromUtc:
      from && Number.isFinite(from.getTime()) ? from.toISOString() : undefined,
    toUtc: to && Number.isFinite(to.getTime()) ? to.toISOString() : undefined,
  }
  const filter = JSON.stringify({ ...filters, status })
  const page = pagination.filter === filter ? pagination.page : 1
  const params = { ...filters, status: status || undefined, page, pageSize }
  const sessions = useQuery({
    queryKey: ['sessions', 'list', params],
    queryFn: ({ signal }) => getSessions(params, signal),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  })
  const counts = useQuery({
    queryKey: ['sessions', 'counts', filters],
    queryFn: async ({ signal }) => {
      const statuses = [undefined, 'active', 'expired', 'revoked'] as const
      const pages = await Promise.all(
        statuses.map((value) =>
          getSessions(
            { ...filters, status: value, page: 1, pageSize: 1 },
            signal,
          ),
        ),
      )
      return {
        all: pages[0].totalCount,
        active: pages[1].totalCount,
        expired: pages[2].totalCount,
        revoked: pages[3].totalCount,
      }
    },
    refetchInterval: 60_000,
  })
  const roles = useQuery({
    queryKey: ['session-roles'],
    queryFn: ({ signal }) => getSessionRoles(signal),
  })
  const total = sessions.data?.totalCount || 0
  const maxPage = Math.max(1, Math.ceil(total / pageSize))
  if (sessions.isSuccess && !sessions.isPlaceholderData && page > maxPage)
    setPagination({ filter, page: maxPage })
  const mutation = useMutation({ mutationFn: revokeSession, retry: false })
  function openRevoke(session: LoginSession | 'all') {
    if (
      session !== 'all' &&
      (session.userId !== actorId || sessionStatus(session) !== 'active')
    )
      return
    setError('')
    setTarget(session)
  }
  function closeRevoke() {
    if (!mutation.isPending) setTarget(null)
  }
  async function confirmRevoke() {
    if (!target || mutation.isPending) return
    if (target !== 'all' && target.userId !== actorId) return
    setError('')
    try {
      await mutation.mutateAsync(
        target === 'all' ? 'all' : target.userSessionId,
      )
      const endsCurrent =
        target === 'all' ||
        target.isCurrent ||
        target.userSessionId === auth?.sessionId
      setTarget(null)
      if (endsCurrent) {
        toast.success('Đã đăng xuất thành công.')
        clearSession()
      } else {
        toast.success('Đã thu hồi phiên đăng nhập.')
        await client.invalidateQueries({ queryKey: ['sessions'] })
      }
    } catch (failure) {
      setError(sessionApiError(failure))
    }
  }
  function resetFilters() {
    setSearch('')
    setDebouncedSearch('')
    setStatus('')
    setRole('')
    setDate('')
    setDevice('')
    setMine(false)
    setPagination({ filter: '', page: 1 })
  }
  function changePage(value: number) {
    setPagination({ filter, page: value })
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  return {
    search,
    status,
    role,
    date,
    device,
    mine,
    roles,
    sessions,
    counts,
    page,
    pageSize,
    total,
    actorId,
    target,
    error,
    pending: mutation.isPending,
    onSearch: setSearch,
    onStatus: setStatus,
    onRole: setRole,
    onDate: setDate,
    onDevice: setDevice,
    onMine: setMine,
    changePage,
    resetFilters,
    openRevoke,
    closeRevoke,
    confirmRevoke,
  }
}
