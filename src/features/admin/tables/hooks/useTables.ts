import { useState, useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { getAllTables, getTable, updateTable } from '../api/tableApi'
import { getRestaurants } from '../../restaurants/api/restaurantApi'
import { getAreas } from '../../areas/api/areaApi'
import type { Restaurant } from '../../restaurants/types/types'
import type { Area } from '../../areas/types/types'
import type { TableMode } from '../types/types'
export function useTables() {
  const [search, setSearch] = useState(''),
    [term, setTerm] = useState(''),
    [restaurantId, setRestaurant] = useState(''),
    [areaId, setArea] = useState(''),
    [status, setStatus] = useState(''),
    [revision, setRevision] = useState(0),
    [target, setTarget] = useState<{ mode: TableMode; id?: string } | null>(
      null,
    )
  const client = useQueryClient()
  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim())
    }, 300)
    return () => clearTimeout(t)
  }, [search])
  const options = useQuery({
    queryKey: ['tables', 'options'],
    queryFn: async ({ signal }) => {
      const restaurants: Restaurant[] = [],
        areas: Area[] = []
      for (let p = 1; ; p++) {
        const d = await getRestaurants({ page: p, pageSize: 100 }, signal)
        restaurants.push(...d.items)
        if (!d.items.length || restaurants.length >= d.totalCount) break
      }
      for (let p = 1; ; p++) {
        const d = await getAreas({ page: p, pageSize: 100 }, signal)
        areas.push(...d.items)
        if (!d.items.length || areas.length >= d.totalCount) break
      }
      return { restaurants, areas }
    },
  })
  const params = {
    search: term || undefined,
    restaurantId: restaurantId || undefined,
    areaId: areaId || undefined,
    isActive: status === '' ? undefined : status === 'true',
  }
  const list = useQuery({
    queryKey: ['tables', 'list', 'all', params],
    queryFn: ({ signal }) => getAllTables(params, signal),
    placeholderData: keepPreviousData,
  })
  const detail = useQuery({
    queryKey: ['tables', 'detail', target?.id],
    queryFn: ({ signal }) => getTable(target!.id!, signal),
    enabled: !!target?.id,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationFn: updateTable,
    retry: false,
    onSuccess: (saved) => {
      if (saved) client.setQueryData(['tables', 'detail', saved.tableId], saved)
      void client.invalidateQueries({ queryKey: ['tables', 'list'] })
      setTarget(null)
      toast.success('Đã cập nhật bàn.')
    },
  })
  return {
    search,
    setSearch,
    restaurantId,
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
      setTarget({ mode, id })
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
    filterRestaurant: (v: string) => {
      setRestaurant(v)
      setArea('')
    },
    filterArea: (v: string) => {
      setArea(v)
    },
    filterStatus: (v: string) => {
      setStatus(v)
    },
    reset: () => {
      setSearch('')
      setTerm('')
      setRestaurant('')
      setArea('')
      setStatus('')
    },
  }
}
