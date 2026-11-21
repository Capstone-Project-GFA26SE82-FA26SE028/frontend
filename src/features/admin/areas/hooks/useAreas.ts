import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  getAreas,
  getArea,
  saveArea,
  setAreaStatus,
  deleteArea,
} from '../api/areaApi'
import { useAppSelector } from '../../../../app/hooks'
import type { AreaValues } from '../schemas/areaSchema'
export function useAreas() {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId || ''
  const actorId = user?.userId
  const scope = `${actorId}:${restaurantId}`
  const canManage =
    !!restaurantId && ['admin', 'manager'].includes(user?.roleId || '')
  const [search, setSearch] = useState(''),
    [term, setTerm] = useState(''),
    [status, setStatus] = useState('')
  const filter = JSON.stringify({ scope, term, status })
  const [pagination, setPagination] = useState({ filter: '', page: 1 })
  const page = pagination.filter === filter ? pagination.page : 1
  const setPage = (page: number) => setPagination({ filter, page })
  const [selection, setTarget] = useState<{
    mode: 'create' | 'view' | 'edit' | 'status' | 'delete'
    id?: string
    scope: string
  } | null>(null)
  const target = selection?.scope === scope ? selection : null
  const client = useQueryClient()
  useEffect(() => {
    const timer = setTimeout(() => {
      setTerm(search.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [search])
  const list = useQuery({
    queryKey: ['areas', restaurantId, actorId, 'list', { page, term, status }],
    enabled: canManage,
    retry: false,
    queryFn: ({ signal }) =>
      getAreas(
        {
          page,
          pageSize: PAGE_SIZE,
          search: term || undefined,
          restaurantId: restaurantId || undefined,
          isActive: status === '' ? undefined : status === 'true',
        },
        signal,
      ),
    placeholderData: (previous, query) =>
      query?.queryKey[1] === restaurantId && query?.queryKey[2] === actorId
        ? previous
        : undefined,
  })
  if (
    list.isSuccess &&
    !list.isPlaceholderData &&
    page > Math.max(1, Math.ceil(list.data.totalCount / PAGE_SIZE))
  )
    setPage(Math.max(1, Math.ceil(list.data.totalCount / PAGE_SIZE)))
  const detail = useQuery({
    queryKey: ['areas', restaurantId, actorId, 'detail', target?.id],
    queryFn: ({ signal }) => getArea(target!.id!, signal),
    enabled: canManage && !!target?.id,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationFn: async (
      action:
        | { kind: 'save'; values: AreaValues; id?: string }
        | { kind: 'status'; id: string; isActive: boolean }
        | { kind: 'delete'; id: string },
    ) => {
      if (!canManage)
        throw new Error('Không có quyền quản lý khu vực của nhà hàng.')
      if (action.kind === 'save')
        return saveArea({ ...action.values, restaurantId }, action.id)
      if (action.kind === 'status')
        return setAreaStatus(action.id, action.isActive)
      await deleteArea(action.id)
      return null
    },
    retry: false,
    onSuccess: (saved) => {
      if (saved)
        client.setQueryData(
          ['areas', restaurantId, actorId, 'detail', saved.areaId],
          saved,
        )
      void client.invalidateQueries({
        queryKey: ['areas', restaurantId, actorId, 'list'],
      })
      setTarget(null)
      toast.success('Đã cập nhật khu vực.')
    },
  })
  function open(mode: NonNullable<typeof target>['mode'], id?: string) {
    mutation.reset()
    if (canManage) setTarget({ mode, id, scope })
  }
  function changePage(value: number) {
    setPage(value)
  }
  return {
    search,
    setSearch,
    restaurantId,
    status,
    page,
    list,
    detail,
    canManage,
    target,
    open,
    mutation,
    close: () => {
      if (!mutation.isPending) setTarget(null)
    },
    changePage,
    filterStatus: (value: string) => {
      setStatus(value)
      setPage(1)
    },
    reset: () => {
      setSearch('')
      setTerm('')
      setStatus('')
      setPage(1)
    },
  }
}
