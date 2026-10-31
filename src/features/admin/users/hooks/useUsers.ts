import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import type { AdminOutletContext } from '../../../../layouts/admin/AdminLayout'
import { userApiError } from '../api/userApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUser,
  getUserRoles,
  getUsers,
  saveUserAccount,
  setUserStatus,
} from '../api/userApi'
import type { AccountFormValues } from '../schemas/userSchema'
import type { UserAccount, UserQuery } from '../types/types'
import { restoreSession } from '../../../auth/api/authApi'
import { store } from '../../../../app/store'

export function useUsers(params: UserQuery) {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: ({ signal }) => getUsers(params, signal),
  })
}
export function useUser(id?: string) {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: ({ signal }) => getUser(id!, signal),
    enabled: !!id,
    staleTime: 0,
  })
}
export function useUserRoles() {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: ({ signal }) => getUserRoles(signal),
  })
}
export function useUserCounts(search?: string, roleId?: string) {
  return useQuery({
    queryKey: ['users', 'counts', { search, roleId }],
    queryFn: async ({ signal }) => {
      const [all, active, locked] = await Promise.all([
        getUsers({ page: 1, pageSize: 1, search, roleId }, signal),
        getUsers(
          { page: 1, pageSize: 1, search, roleId, isActive: true },
          signal,
        ),
        getUsers(
          { page: 1, pageSize: 1, search, roleId, isActive: false },
          signal,
        ),
      ])
      return {
        all: all.totalCount,
        active: active.totalCount,
        locked: locked.totalCount,
      }
    },
  })
}
export function useUserMutations() {
  const client = useQueryClient()
  const invalidate = async (user: UserAccount) => {
    await client.invalidateQueries({ queryKey: ['users'] })
    if (store.getState().auth.session?.user.userId === user.id)
      await restoreSession()
  }
  const save = useMutation({
    mutationFn: ({
      values,
      existing,
    }: {
      values: AccountFormValues
      existing?: UserAccount
    }) => saveUserAccount(values, existing),
    onSuccess: invalidate,
    onError: async () => {
      // Refresh partially saved details without remounting the authenticated page.
      await client.invalidateQueries({ queryKey: ['users'] })
    },
    retry: false,
    gcTime: 0,
  })
  const status = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      setUserStatus(id, active),
    onSuccess: invalidate,
    retry: false,
  })
  return { save, status }
}

export function useUserManagement() {
  const actorId = useAppSelector((state) => state.auth.session?.user.userId)
  const { query, setQuery } = useOutletContext<AdminOutletContext>()
  const [search, setSearch] = useState(query.trim())
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [pagination, setPagination] = useState({ filter: '', page: 1 })
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])
  const filter = JSON.stringify({ search, role, status })
  const page = pagination.filter === filter ? pagination.page : 1
  const setPage = (value: number) => setPagination({ filter, page: value })
  const params = {
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    roleId: role === 'all' ? undefined : role,
    isActive: status === 'all' ? undefined : status === 'active',
  }
  const users = useUsers(params)
  const counts = useUserCounts(search || undefined, params.roleId)
  const totals = useUserCounts()
  const admins = useUsers({
    page: 1,
    pageSize: 1,
    roleId: 'admin',
    isActive: true,
  })
  const roles = useUserRoles()
  const mutations = useUserMutations()
  const [form, setForm] = useState<string | null | undefined>()
  const [target, setTarget] = useState<UserAccount | null>(null)
  const [detailId, setDetailId] = useState<string>()
  const [statusError, setStatusError] = useState('')
  const rows = users.data?.items || []
  const total = users.data?.totalCount || 0
  const maxPage = Math.max(1, Math.ceil(total / params.pageSize))
  if (users.isSuccess && page > maxPage) {
    setPagination({ filter, page: maxPage })
  }

  async function save(values: AccountFormValues, existing?: UserAccount) {
    try {
      await mutations.save.mutateAsync({ values, existing })
      setForm(undefined)
      toast.success(existing ? 'Đã cập nhật tài khoản.' : 'Đã tạo tài khoản.')
      return ''
    } catch (error) {
      return userApiError(error)
    }
  }
  function openStatus(user: UserAccount) {
    if (user.id === actorId && user.active) {
      toast.error('Bạn không thể vô hiệu hóa tài khoản của chính mình.')
      return
    }
    setTarget(user)
    setStatusError('')
  }

  async function confirmStatus() {
    if (!target || mutations.status.isPending) return
    setStatusError('')
    try {
      await mutations.status.mutateAsync({
        id: target.id,
        active: !target.active,
      })
      setTarget(null)
      toast.success('Đã cập nhật trạng thái tài khoản.')
    } catch (error) {
      setStatusError(userApiError(error))
    }
  }

  function retryStatistics() {
    void totals.refetch()
    void admins.refetch()
    void counts.refetch()
  }

  return {
    query,
    setQuery,
    role,
    setRole,
    status,
    setStatus,
    page,
    setPage,
    users,
    counts,
    totals,
    admins,
    roles,
    rows,
    total,
    maxPage,
    form,
    setForm,
    target,
    setTarget,
    detailId,
    setDetailId,
    statusError,
    statusPending: mutations.status.isPending,
    save,
    openStatus,
    confirmStatus,
    retryStatistics,
  }
}
