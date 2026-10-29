import { useState, useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  getAreas,
  getArea,
  saveArea,
  setAreaStatus,
  deleteArea,
} from '../api/areaApi'
import { getRestaurants } from '../../restaurants/api/restaurantApi'
import type { Restaurant } from '../../restaurants/types/types'
import type { AreaValues } from '../schemas/areaSchema'
export function useAreas() {
  const [search, setSearch] = useState(''),
    [term, setTerm] = useState(''),
    [restaurantId, setRestaurantId] = useState(''),
    [status, setStatus] = useState(''),
    [page, setPage] = useState(1)
  const [target, setTarget] = useState<{
    mode: 'create' | 'view' | 'edit' | 'status' | 'delete'
    id?: string
  } | null>(null)
  const client = useQueryClient()
  useEffect(() => {
    const timer = setTimeout(() => {
      setTerm(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])
  const restaurants = useQuery({
    queryKey: ['areas', 'restaurant-options'],
    queryFn: async ({ signal }) => {
      const all: Restaurant[] = []
      let next = 1
      while (true) {
        const data = await getRestaurants({ page: next, pageSize: 100 }, signal)
        all.push(...data.items)
        if (all.length >= data.totalCount || !data.items.length) return all
        next++
      }
    },
  })
  const list = useQuery({
    queryKey: ['areas', 'list', { page, term, restaurantId, status }],
    queryFn: ({ signal }) =>
      getAreas(
        {
          page,
          pageSize: 10,
          search: term || undefined,
          restaurantId: restaurantId || undefined,
          isActive: status === '' ? undefined : status === 'true',
        },
        signal,
      ),
    placeholderData: keepPreviousData,
  })
  if (
    list.isSuccess &&
    !list.isPlaceholderData &&
    page > Math.max(1, Math.ceil(list.data.totalCount / 10))
  )
    setPage(Math.max(1, Math.ceil(list.data.totalCount / 10)))
  const detail = useQuery({
    queryKey: ['areas', 'detail', target?.id],
    queryFn: ({ signal }) => getArea(target!.id!, signal),
    enabled: !!target?.id,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationFn: async (
      action:
        | { kind: 'save'; values: AreaValues; id?: string }
        | { kind: 'status'; id: string; isActive: boolean }
        | { kind: 'delete'; id: string },
    ) => {
      if (action.kind === 'save') return saveArea(action.values, action.id)
      if (action.kind === 'status')
        return setAreaStatus(action.id, action.isActive)
      await deleteArea(action.id)
      return null
    },
    onSuccess: (saved) => {
      if (saved) client.setQueryData(['areas', 'detail', saved.areaId], saved)
      void client.invalidateQueries({ queryKey: ['areas', 'list'] })
      setTarget(null)
      toast.success('Đã cập nhật khu vực.')
    },
  })
  function open(mode: NonNullable<typeof target>['mode'], id?: string) {
    mutation.reset()
    setTarget({ mode, id })
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
    search,
    setSearch,
    restaurantId,
    status,
    page,
    list,
    detail,
    restaurants,
    target,
    open,
    mutation,
    close: () => {
      if (!mutation.isPending) setTarget(null)
    },
    changePage,
    filterRestaurant: (value: string) => {
      setRestaurantId(value)
      setPage(1)
    },
    filterStatus: (value: string) => {
      setStatus(value)
      setPage(1)
    },
    reset: () => {
      setSearch('')
      setTerm('')
      setRestaurantId('')
      setStatus('')
      setPage(1)
    },
  }
}
