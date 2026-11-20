import type { StaffAccount } from '../types/types'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  assignRestaurantStaff,
  getRestaurantStaff,
  removeRestaurantStaff,
  restaurantStaffError,
  searchStaffAccounts,
} from '../api/restaurantStaffApi'

export function useRestaurantStaff(restaurantId: string) {
  const client = useQueryClient()
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const key = ['restaurants', 'staff', restaurantId]
  const list = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getRestaurantStaff(restaurantId, signal),
    retry: false,
  })
  const active = (list.data || []).filter((assignment) => assignment.isActive)
  const rows = active.filter((row) =>
    [row.userIdRef, row.fullName, row.userName, row.email].some((value) =>
      value?.toLowerCase().includes(search.trim().toLowerCase()),
    ),
  )
  const change = useMutation({
    mutationFn: ({ userId, remove }: { userId: string; remove: boolean }) =>
      remove
        ? removeRestaurantStaff(restaurantId, userId)
        : assignRestaurantStaff(restaurantId, userId),
    retry: false,
    onSuccess: (saved, variables) => {
      client.setQueryData<typeof list.data>(key, (old) => [
        ...(old || []).filter((row) => row.userIdRef !== saved.userIdRef),
        saved,
      ])
      setRemoving(null)
      if (!variables.remove) setAdding(false)
      toast.success(
        variables.remove
          ? 'Đã gỡ nhân viên khỏi nhà hàng.'
          : 'Đã thêm nhân viên vào nhà hàng.',
      )
    },
    onError: (error) => toast.error(restaurantStaffError(error)),
    onSettled: () => {
      void client.invalidateQueries({ queryKey: key })
    },
  })
  return {
    list,
    restaurantId,
    active,
    search,
    setSearch,
    rows,
    change,
    adding,
    setAdding,
    removing,
    setRemoving,
  }
}

export function useStaffAccountSearch() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<StaffAccount | null>(null)
  const [keyword, setKeyword] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(() => setKeyword(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])
  const query = useQuery({
    queryKey: ['staff-account-search', keyword, page],
    queryFn: ({ signal }) => searchStaffAccounts(keyword, page, signal),
    enabled: !!keyword && keyword === search.trim(),
    retry: false,
    refetchOnWindowFocus: false,
  })
  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
    setSelected(null)
  }
  function changePage(value: number) {
    setPage(value)
    setSelected(null)
  }
  return {
    search,
    page,
    selected,
    selectAccount: setSelected,
    changeSearch,
    changePage,
    query,
    waiting: keyword !== search.trim(),
  }
}
