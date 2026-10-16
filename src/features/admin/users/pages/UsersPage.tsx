import { UserFilters } from '../components/UserFilters'
import { UserTable } from '../components/UserTable'
import { UserDetailModal } from '../components/UserDetailModal'
import { UserStatusModal } from '../components/UserStatusModal'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import type { AdminOutletContext } from '../../../../layouts/admin/AdminLayout'
import {
  Panel,
  SummaryCards,
  primaryButton,
  secondaryButton,
  Pagination,
  Notice,
} from '../../components/AdminUI'
import { UserForm } from '../components/UserForm'
import { saveUser, userRuleError } from '../usersSlice'
import { roleLabels, type AdminUser } from '../types'
import { audit } from '../../activity/createAudit'
import { matches, downloadCsv } from '../../utils'
export function UsersPage() {
  const state = useAppSelector((s) => s.admin)
  const dispatch = useAppDispatch()
  const { query: globalQuery } = useOutletContext<AdminOutletContext>()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<AdminUser | null | undefined>(undefined)
  const [target, setTarget] = useState<AdminUser | null>(null)
  const [detail, setDetail] = useState<AdminUser | null>(null)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const restaurantName = (id: string) =>
    state.restaurants.find((r) => r.id === id)?.name ?? 'Toàn nền tảng'
  const matchingUsers = state.users.filter(
    (u) =>
      matches(query, u.name, u.email, restaurantName(u.restaurantId)) &&
      matches(globalQuery, u.name, u.email, restaurantName(u.restaurantId)) &&
      (role === 'all' || u.role === role),
  )
  const rows = matchingUsers.filter(
    (u) => status === 'all' || u.active === (status === 'active'),
  )
  const current = Math.min(page, Math.max(1, Math.ceil(rows.length / 6)))
  const visible = rows.slice((current - 1) * 6, current * 6)
  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tài khoản người dùng
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {state.users.length} tài khoản · Quản lý thông tin, vai trò và quyền
            truy cập.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={!rows.length}
            className={secondaryButton}
            onClick={() =>
              downloadCsv(
                'nguoi-dung',
                ['Họ tên', 'Email', 'Vai trò', 'Phạm vi', 'Trạng thái'],
                rows.map((u) => [
                  u.name,
                  u.email,
                  roleLabels[u.role],
                  restaurantName(u.restaurantId),
                  u.active ? 'Hoạt động' : 'Đã khóa',
                ]),
              )
            }
          >
            <Icon name="download" size={16} />
            Xuất CSV
          </button>
          <button onClick={() => setForm(null)} className={primaryButton}>
            <Icon name="plus" size={18} />
            Thêm tài khoản
          </button>
        </div>
      </header>
      <SummaryCards
        items={[
          {
            label: 'Tổng người dùng',
            value: state.users.length,
            icon: 'users',
            note: 'Tất cả tài khoản',
          },
          {
            label: 'Đang hoạt động',
            value: state.users.filter((u) => u.active).length,
            icon: 'check',
            note: 'Tài khoản được kích hoạt',
          },
          {
            label: 'Đang bị khóa',
            value: state.users.filter((u) => !u.active).length,
            icon: 'shield',
            note: 'Giữ nguyên lịch sử',
          },
          {
            label: 'Quản trị viên',
            value: state.users.filter((u) => u.role === 'Admin' && u.active)
              .length,
            icon: 'settings',
            note: 'Admin đang hoạt động',
          },
        ]}
      />
      {notice && <Notice>{notice}</Notice>}
      <Panel>
        <UserFilters
          query={query}
          role={role}
          status={status}
          matchingUsers={matchingUsers}
          onQuery={(v) => {
            setQuery(v)
            setPage(1)
          }}
          onRole={(v) => {
            setRole(v)
            setPage(1)
          }}
          onStatus={(v) => {
            setStatus(v)
            setPage(1)
          }}
        />
        <UserTable
          visible={visible}
          restaurantName={restaurantName}
          onDetail={setDetail}
          onEdit={setForm}
          onStatus={(u) => {
            setTarget(u)
            setReason('')
            setError('')
          }}
        />
        <Pagination total={rows.length} page={current} onPage={setPage} />
      </Panel>
      {form !== undefined && (
        <UserForm
          user={form}
          restaurants={state.restaurants}
          onClose={() => setForm(undefined)}
          onSave={(values) => {
            const user: AdminUser = {
              ...values,
              id: form?.id ?? crypto.randomUUID(),
              active: form?.active ?? true,
              created: form?.created ?? new Date().toISOString().slice(0, 10),
            }
            const error = userRuleError(state, user)
            if (error) return error
            dispatch(
              saveUser({
                user,
                audit: audit(
                  form ? 'Cập nhật tài khoản' : 'Tạo tài khoản',
                  user.name,
                ),
              }),
            )
            setForm(undefined)
            setNotice(
              form
                ? 'Đã cập nhật tài khoản.'
                : 'Đã tạo hồ sơ tài khoản trong bản dùng thử.',
            )
            return ''
          }}
        />
      )}
      {target && (
        <UserStatusModal
          user={target}
          reason={reason}
          error={error}
          onReason={setReason}
          onClose={() => setTarget(null)}
          onConfirm={() => {
            const user = { ...target, active: !target.active }
            const message = userRuleError(state, user)
            if (message) {
              setError(message)
              return
            }
            dispatch(
              saveUser({
                user,
                audit: audit(
                  target.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
                  target.name,
                  reason.trim(),
                ),
              }),
            )
            setTarget(null)
            setNotice('Đã cập nhật trạng thái tài khoản.')
          }}
        />
      )}
      {detail && (
        <UserDetailModal
          user={detail}
          history={state.audit}
          restaurantName={restaurantName}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  )
}
