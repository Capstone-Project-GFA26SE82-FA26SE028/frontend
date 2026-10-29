import { useState, useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { getTables, getTable, updateTable } from '../api/tableApi'
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
    [page, setPage] = useState(1),
    [revision, setRevision] = useState(0),
    [target, setTarget] = useState<{ mode: TableMode; id?: string } | null>(
      null,
    )
  const client = useQueryClient()
  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim())
      setPage(1)
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
  const list = useQuery({
    queryKey: ['tables', 'list', { page, term, restaurantId, areaId, status }],
    queryFn: ({ signal }) =>
      getTables(
        {
          page,
          pageSize: 12,
          search: term || undefined,
          restaurantId: restaurantId || undefined,
          areaId: areaId || undefined,
          isActive: status === '' ? undefined : status === 'true',
        },
        signal,
      ),
    placeholderData: keepPreviousData,
  })
  if (
    list.isSuccess &&
    !list.isPlaceholderData &&
    page > Math.max(1, Math.ceil(list.data.totalCount / 12))
  )
    setPage(Math.max(1, Math.ceil(list.data.totalCount / 12)))
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
    page,
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
      setPage(1)
    },
    filterArea: (v: string) => {
      setArea(v)
      setPage(1)
    },
    filterStatus: (v: string) => {
      setStatus(v)
      setPage(1)
    },
    reset: () => {
      setSearch('')
      setTerm('')
      setRestaurant('')
      setArea('')
      setStatus('')
      setPage(1)
    },
    changePage: (v: number) => {
      setPage(v)
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
    },
  }
}
