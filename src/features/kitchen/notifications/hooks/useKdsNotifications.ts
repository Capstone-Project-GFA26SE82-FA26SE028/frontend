import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { notificationApi } from '../api/notificationApi'
import { NOTIFICATION_POLL_MS } from '../constants/notification'
import { notificationAccessDenied } from '../utils/notification'

const readPolicy = {
  retry: (count: number, error: unknown) =>
    !notificationAccessDenied(error) && count < 2,
  retryOnMount: true,
  staleTime: 5000,
  refetchInterval: (query: { state: { error: unknown } }) =>
    notificationAccessDenied(query.state.error)
      ? (false as const)
      : NOTIFICATION_POLL_MS,
  refetchOnWindowFocus: (query: { state: { error: unknown } }) =>
    !notificationAccessDenied(query.state.error),
  refetchOnReconnect: (query: { state: { error: unknown } }) =>
    !notificationAccessDenied(query.state.error),
}

export function useKdsNotifications(open: boolean) {
  const user = useAppSelector((s) => s.auth.session?.user)
  const client = useQueryClient()
  const key = ['kitchen-notifications', user?.userId, user?.restaurantId]
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const enabled = !!user
  const unread = useQuery({
    ...readPolicy,
    queryKey: [...key, 'unread'],
    enabled,
    queryFn: ({ signal }) => notificationApi.unread(signal),
  })
  const list = useQuery({
    ...readPolicy,
    queryKey: [...key, 'list', page, type, unreadOnly],
    enabled: enabled && open,
    queryFn: ({ signal }) =>
      notificationApi.list({ page, type, unreadOnly }, signal),
  })
  const detail = useQuery({
    ...readPolicy,
    queryKey: [...key, 'detail', selectedId],
    enabled: enabled && open && !!selectedId,
    queryFn: ({ signal }) => notificationApi.detail(selectedId, signal),
  })
  const markRead = useMutation({
    mutationFn: (id: string | undefined) => notificationApi.markRead(id),
    onSuccess: async () => {
      await client.cancelQueries({ queryKey: key })
      setPage(1)
      await client.invalidateQueries({ queryKey: key })
    },
  })
  return {
    unread,
    list,
    detail,
    markRead,
    page,
    setPage,
    type,
    unreadOnly,
    selectedId,
    select: (id: string) => {
      setSelectedId(id)
      markRead.reset()
    },
    filterType: (value: string) => {
      setType(value)
      setPage(1)
      setSelectedId('')
    },
    filterUnread: (value: boolean) => {
      setUnreadOnly(value)
      setPage(1)
      setSelectedId('')
    },
    refresh: () => {
      void client.cancelQueries({ queryKey: key })
      void client.invalidateQueries({ queryKey: key })
      void list.refetch()
      void unread.refetch()
    },
  }
}
