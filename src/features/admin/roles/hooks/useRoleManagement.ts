import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { roles, roleLabels, type Role } from '../../users/types'
import { audit } from '../../activity/createAudit'
import { downloadCsv, matches } from '../../utils'
import { saveUser, userRuleError } from '../../users/usersSlice'
import { roleDescriptions } from '../data'
import type { RoleTab } from '../components/RoleTabs'
import type { RoleAssignmentValues } from '../schemas/roleAssignmentSchema'
export function useRoleManagement(globalQuery: string) {
  const state = useAppSelector((s) => s.admin)
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<RoleTab>('roles')
  const [role, setRole] = useState<Role | 'all'>('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState('')
  const matchingUsers = state.users.filter(
    (u) =>
      (role === 'all' || u.role === role) &&
      matches(
        query,
        u.name,
        u.email,
        state.restaurants.find((r) => r.id === u.restaurantId)?.name || '',
      ) &&
      matches(
        globalQuery,
        u.name,
        u.email,
        roleLabels[u.role],
        state.restaurants.find((r) => r.id === u.restaurantId)?.name || '',
      ),
  )
  const users = matchingUsers.filter(
    (u) => status === 'all' || u.active === (status === 'active'),
  )
  const current = Math.min(page, Math.max(1, Math.ceil(users.length / 6)))

  const selectedUser = state.users.find((u) => u.id === selected)
  function closeModal() {
    setSelected('')
  }
  function changeTab(value: RoleTab) {
    setTab(value)
    closeModal()
  }
  function changeRole(value: Role | 'all') {
    setRole(value)
    setPage(1)
    closeModal()
  }
  function changeQuery(value: string) {
    setQuery(value)
    setPage(1)
    closeModal()
  }
  function changePage(value: number) {
    setPage(value)
    closeModal()
  }
  function saveAssignment(v: RoleAssignmentValues) {
    const u = selectedUser
    if (!u) return 'Không tìm thấy tài khoản.'
    if (v.role === u.role && v.restaurantId === u.restaurantId)
      return 'Bạn chưa thay đổi vai trò hoặc nhà hàng.'
    const updated = {
      ...u,
      role: v.role,
      restaurantId: v.restaurantId,
    }
    const message = userRuleError(state, updated)
    if (message) return message
    dispatch(
      saveUser({
        user: updated,
        audit: audit(
          'Thay đổi phân công vai trò',
          u.name,
          `${roleLabels[u.role]} → ${roleLabels[v.role]}. ${v.reason}`,
        ),
      }),
    )
    setSelected('')
    setNotice('Đã lưu phân công và nhật ký thay đổi.')
    return ''
  }
  function exportRoles() {
    downloadCsv(
      'vai-tro',
      ['Vai trò', 'Phạm vi dự kiến', 'Nghiệp vụ dự kiến', 'Số tài khoản'],
      roles.map((r) => [
        roleLabels[r],
        roleDescriptions[r].scope,
        roleDescriptions[r].tasks.join('; '),
        state.users.filter((u) => u.role === r).length,
      ]),
    )
  }
  return {
    status,
    matchingUsers,
    changeStatus: (value: string) => {
      setStatus(value)
      setPage(1)
      closeModal()
    },
    allUsers: state.users,
    restaurants: state.restaurants,
    users,
    tab,
    role,
    query,
    page: current,
    notice,
    selected,
    selectedUser,
    changeTab,
    changeRole,
    changeQuery,
    changePage,
    selectUser: setSelected,
    closeModal,
    saveAssignment,
    exportRoles,
  }
}
