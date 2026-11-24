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
  uploadRestaurantLogo,
  restaurantError,
} from '../api/restaurantApi'
import type { RestaurantValues } from '../schemas/restaurantSchema'
const pageSize = 12
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
    mutationFn: async ({
      values,
      id,
      logoFile,
    }: {
      values: RestaurantValues
      id?: string
      logoFile?: File
    }) => {
      if (logoFile && (!logoFile.size || logoFile.size > 2 * 1024 * 1024))
        throw new Error('Chọn ảnh JPEG, PNG hoặc WebP tối đa 2 MiB.')
      const saved = await saveRestaurant(values, id)
      if (!logoFile) return { saved }
      try {
        const logoUrl = await uploadRestaurantLogo(saved.restaurantId, logoFile)
        return { saved: { ...saved, logoUrl } }
      } catch (error) {
        return { saved, logoError: restaurantError(error) }
      }
    },
    retry: false,
    onSuccess: ({ saved, logoError }) => {
      client.setQueryData(['restaurants', 'detail', saved.restaurantId], saved)
      void client.invalidateQueries({ queryKey: ['restaurants', 'list'] })
      setTarget(null)
      if (logoError)
        toast.warn(`Đã lưu nhà hàng. Tải logo thất bại: ${logoError}`)
      else toast.success('Đã lưu thông tin nhà hàng.')
    },
  })
  function changePage(value: number) {
    setPage(value)
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
