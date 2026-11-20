import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  getAllTables,
  getTable,
  updateTable,
  type TableAction,
} from '../api/tableApi'
import { getAreas } from '../../areas/api/areaApi'
import { useAppSelector } from '../../../../app/hooks'
import type { Area } from '../../areas/types/types'
import type { TableMode } from '../types/types'
export function useTables() {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId || ''
  const actorId = user?.userId
  const scope = `${actorId}:${restaurantId}`
  const canManage =
    !!restaurantId && ['admin', 'manager'].includes(user?.roleId || '')
  const [search, setSearch] = useState(''),
    [term, setTerm] = useState(''),
    [selectedArea, setArea] = useState({ scope, id: '' }),
    [status, setStatus] = useState(''),
    [revision, setRevision] = useState(0),
    [selection, setTarget] = useState<{
      mode: TableMode
      id?: string
      scope: string
    } | null>(null)
  const areaId = selectedArea.scope === scope ? selectedArea.id : ''
  const target = selection?.scope === scope ? selection : null
  const client = useQueryClient()
  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim())
    }, 300)
    return () => clearTimeout(t)
  }, [search])
  const options = useQuery({
    queryKey: ['tables', restaurantId, actorId, 'options'],
    enabled: canManage,
    retry: false,
    queryFn: async ({ signal }) => {
      const areas: Area[] = []
      for (let p = 1; ; p++) {
        const d = await getAreas(
          { restaurantId, page: p, pageSize: 100 },
          signal,
        )
        areas.push(...d.items)
        if (!d.items.length || areas.length >= d.totalCount) break
      }
      return { areas }
    },
  })
  const params = {
    search: term || undefined,
    restaurantId: restaurantId || undefined,
    areaId: areaId || undefined,
    isActive: status === '' ? undefined : status === 'true',
  }
  const list = useQuery({
    queryKey: ['tables', restaurantId, actorId, 'list', 'all', params],
    enabled: canManage,
    retry: false,
    queryFn: ({ signal }) => getAllTables(params, signal),
    placeholderData: (previous, query) =>
      query?.queryKey[1] === restaurantId && query?.queryKey[2] === actorId
        ? previous
        : undefined,
  })
  const detail = useQuery({
    queryKey: ['tables', restaurantId, actorId, 'detail', target?.id],
    queryFn: ({ signal }) => getTable(target!.id!, signal),
    enabled: canManage && !!target?.id,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationFn: (action: TableAction) => {
      if (!canManage)
        throw new Error('Không có quyền quản lý bàn của nhà hàng.')
      if (action.kind === 'save' || action.kind === 'move') {
        const destinationId =
          action.kind === 'save' ? action.values.areaId : action.areaId
        if (
          !options.data?.areas.some(
            (area) =>
              area.areaId === destinationId &&
              area.restaurantId === restaurantId &&
              area.isActive,
          )
        ) {
          throw new Error(
            'Vui lòng chọn khu vực đang hoạt động trong nhà hàng của bạn.',
          )
        }
      }
      return updateTable(action)
    },
    retry: false,
    onSuccess: (saved) => {
      if (saved)
        client.setQueryData(
          ['tables', restaurantId, actorId, 'detail', saved.tableId],
          saved,
        )
      void client.invalidateQueries({
        queryKey: ['tables', restaurantId, actorId, 'list'],
      })
      void client.invalidateQueries({
        queryKey: ['table-qr', restaurantId, actorId],
      })
      setTarget(null)
      toast.success('Đã cập nhật bàn.')
    },
  })
  return {
    search,
    setSearch,
    restaurantId,
    scope,
    canManage,
    areaId,
    status,
    revision,
    target,
    list,
    detail,
    options,
    mutation,
    open: (mode: TableMode, id?: string) => {
      mutation.reset()
      if (canManage) setTarget({ mode, id, scope })
    },
    close: () => {
      if (!mutation.isPending) setTarget(null)
    },
    reload: async () => {
      const r = await detail.refetch()
      if (r.isSuccess) {
        mutation.reset()
        setRevision((v) => v + 1)
      }
    },
    filterArea: (v: string) => {
      setArea({ scope, id: v })
    },
    filterStatus: (v: string) => {
      setStatus(v)
    },
    reset: () => {
      setSearch('')
      setTerm('')
      setArea({ scope, id: '' })
      setStatus('')
    },
  }
}
