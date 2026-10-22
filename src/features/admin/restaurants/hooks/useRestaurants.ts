import { useState, useEffect } from 'react'
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  getRestaurants,
  getRestaurant,
  saveRestaurant,
} from '../api/restaurantApi'
import type { RestaurantValues } from '../schemas/restaurantSchema'
const pageSize = 10
export function useRestaurants() {
  const [search, setSearch] = useState(''),
    [term, setTerm] = useState(''),
    [page, setPage] = useState(1)
  const [target, setTarget] = useState<{
    mode: 'view' | 'edit' | 'create'
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
  const list = useQuery({
    queryKey: ['restaurants', 'list', { page, search: term }],
    queryFn: ({ signal }) =>
      getRestaurants({ page, pageSize, search: term || undefined }, signal),
    placeholderData: keepPreviousData,
  })
  if (
    list.isSuccess &&
    !list.isPlaceholderData &&
    page > Math.max(1, Math.ceil(list.data.totalCount / pageSize))
  )
    setPage(Math.max(1, Math.ceil(list.data.totalCount / pageSize)))
  const detail = useQuery({
    queryKey: ['restaurants', 'detail', target?.id],
    queryFn: ({ signal }) => getRestaurant(target!.id!, signal),
    enabled: !!target?.id,
    refetchOnWindowFocus: false,
  })
  const save = useMutation({
    mutationFn: ({ values, id }: { values: RestaurantValues; id?: string }) =>
      saveRestaurant(values, id),
    retry: false,
    onSuccess: (saved) => {
      client.setQueryData(['restaurants', 'detail', saved.restaurantId], saved)
      void client.invalidateQueries({ queryKey: ['restaurants', 'list'] })
      setTarget(null)
      toast.success('Restaurant saved successfully.')
    },
  })
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
    page,
    pageSize,
    list,
    target,
    setTarget,
    detail,
    save,
    changePage,
  }
}
