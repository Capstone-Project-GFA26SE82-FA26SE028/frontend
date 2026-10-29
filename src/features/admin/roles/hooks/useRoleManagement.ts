import { useEffect, useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { store } from '../../../../app/store'
import { clearSession } from '../../../auth/api/authApi'
import {
  assignRole,
  getRoles,
  getRoleUsers,
  roleApiError,
} from '../api/roleApi'
import type { RoleAccount } from '../types/types'
import type { RoleTab } from '../components/RoleTabs'
import type { RoleAssignmentValues } from '../schemas/roleAssignmentSchema'

const pageSize = 10
export function useRoleManagement() {
  const client = useQueryClient()
  const [tab, setTab] = useState<RoleTab>('roles')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ filter: '', page: 1 })
  const [selectedUser, setSelectedUser] = useState<RoleAccount | null>(null)
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])
  const roles = useQuery({
    queryKey: ['roles'],
    queryFn: ({ signal }) => getRoles(signal),
  })
  const roleCounts = useQueries({
    queries: (roles.data || []).map((item) => ({
      queryKey: ['users', 'role-count', item.roleId],
      queryFn: async ({ signal }: { signal: AbortSignal }) =>
        (
          await getRoleUsers(
            { page: 1, pageSize: 1, roleId: item.roleId },
            signal,
          )
        ).totalCount,
    })),
  })
  const summary = useQuery({
    queryKey: ['users', 'role-summary'],
    queryFn: async ({ signal }) => {
      const [all, active, admins] = await Promise.all([
        getRoleUsers({ page: 1, pageSize: 1 }, signal),
        getRoleUsers({ page: 1, pageSize: 1, isActive: true }, signal),
        getRoleUsers(
          { page: 1, pageSize: 1, roleId: 'admin', isActive: true },
          signal,
        ),
      ])
      return {
        total: all.totalCount,
        active: active.totalCount,
        admins: admins.totalCount,
      }
    },
  })
  const filter = JSON.stringify({ search, role, status })
  const page = pagination.filter === filter ? pagination.page : 1
  const params = {
    page,
    pageSize,
    search: search || undefined,
    roleId: role === 'all' ? undefined : role,
    isActive: status === 'all' ? undefined : status === 'active',
  }
  const users = useQuery({
    queryKey: ['users', 'role-assignments', params],
    queryFn: ({ signal }) => getRoleUsers(params, signal),
    enabled: tab === 'assignments',
    placeholderData: keepPreviousData,
  })
  const maxPage = Math.max(
    1,
    Math.ceil((users.data?.totalCount || 0) / pageSize),
  )
  if (users.isSuccess && !users.isPlaceholderData && page > maxPage) {
    setPagination({ filter, page: maxPage })
  }
  const mutation = useMutation({
    mutationFn: ({ id, roleId }: { id: string; roleId: string }) =>
      assignRole(id, roleId),
    retry: false,
  })
  function closeModal() {
    if (!mutation.isPending) setSelectedUser(null)
  }
  function changeTab(value: RoleTab) {
    setTab(value)
    closeModal()
  }
  function changeRole(value: string) {
    setRole(value)
    setPagination({ filter: '', page: 1 })
    closeModal()
  }
  function changeStatus(value: string) {
    setStatus(value)
    setPagination({ filter: '', page: 1 })
    closeModal()
  }
  function changeQuery(value: string) {
    setQuery(value)
    closeModal()
  }
  function changePage(value: number) {
    setPagination({ filter, page: value })
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  async function saveAssignment(values: RoleAssignmentValues) {
    if (!selectedUser || mutation.isPending)
      return 'Unable to update this account.'
    if (values.role === selectedUser.roleId) return 'Select a different role.'
    if (!roles.data?.some((item) => item.roleId === values.role))
      return 'The selected role is no longer available.'
    try {
      const updated = await mutation.mutateAsync({
        id: selectedUser.userId,
        roleId: values.role,
      })
      setSelectedUser(null)
      if (updated.userId === store.getState().auth.session?.user.userId) {
        toast.success(
          'Vai trò của bạn đã được cập nhật. Vui lòng đăng nhập lại.',
        )
        clearSession()
      } else {
        toast.success('Đã cập nhật vai trò thành công.')
        await client.invalidateQueries({ queryKey: ['users'] })
      }
      return ''
    } catch (error) {
      // Do not restore the auth session here: it would unmount this modal.
      void client.invalidateQueries({ queryKey: ['users'] })
      return roleApiError(error)
    }
  }
  const counts = Object.fromEntries(
    (roles.data || []).map((item, index) => [
      item.roleId,
      roleCounts[index]?.isError ? undefined : roleCounts[index]?.data,
    ]),
  )
  const countsFailed = roleCounts.some((item) => item.isError)
  function retryStatistics() {
    void summary.refetch()
    roleCounts.forEach((item) => {
      void item.refetch()
    })
  }
  return {
    roles,
    users,
    summary,
    counts,
    countsFailed,
    retryStatistics,
    tab,
    role,
    status,
    query,
    page,
    pageSize,
    selectedUser,
    changeTab,
    changeRole,
    changeStatus,
    changeQuery,
    changePage,
    closeModal,
    saveAssignment,
    selectUser: setSelectedUser,
    viewRoleUsers: (id: string) => {
      changeRole(id)
      setStatus('all')
      setQuery('')
      setSearch('')
      changeTab('assignments')
    },
  }
}
