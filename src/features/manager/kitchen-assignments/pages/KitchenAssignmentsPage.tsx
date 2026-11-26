import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Panel } from '../../../../components/Panel/Panel'
import { Modal } from '../../../../components/Modal/Modal'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SearchField } from '../../../../components/SearchField/SearchField'
import {
  ASSIGNMENT_PAGE_SIZE,
  buttonClass,
  inputClass,
  primaryClass,
} from '../constants/assignment'
import { useKitchenAssignments } from '../hooks/useKitchenAssignments'
import {
  assignmentError,
  assignmentRows,
  employeeName,
  matchesAssignment,
} from '../utils/assignment'
import { AssignmentForm } from '../components/AssignmentForm'
import { AssignmentTable } from '../components/AssignmentTable'
import type { AssignmentRow } from '../types/assignment'

export function KitchenAssignmentsPage() {
  const user = useAppSelector((s) => s.auth.session?.user)
  return <AssignmentsWorkspace key={`${user?.userId}:${user?.restaurantId}`} />
}

function AssignmentsWorkspace() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [target, setTarget] = useState<{
    row: AssignmentRow
    remove: boolean
  } | null>(null)
  const [notice, setNotice] = useState('')
  const m = useKitchenAssignments(() => {
    setTarget(null)
    setNotice('Đã cập nhật phân công bếp.')
  })
  const rows = assignmentRows(m.stations.data || [], m.assignments.data || [])
  const filtered = rows.filter(
    (row) =>
      matchesAssignment(
        `${row.kitchenStationCode} ${row.kitchenStationName} ${employeeName(row.assignment?.employee)} ${row.assignment?.employee?.email || ''}`,
        search,
      ) &&
      (status === '' ||
        (status === 'assigned' ? !!row.assignment : !row.assignment)),
  )
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / ASSIGNMENT_PAGE_SIZE)),
  )
  const queries = [m.stations, m.assignments, m.employees]
  const errors = queries
    .filter((q) => q.isError)
    .map((q) => assignmentError(q.error))
  const loading = queries.some((q) => q.isPending)
  const refreshing = queries.some((q) => q.isFetching)
  const open = (row: AssignmentRow, remove: boolean) => {
    m.mutation.reset()
    setNotice('')
    setTarget({ row, remove })
  }
  return (
    <>
      <PageHeading
        eyebrow="Thiết lập bếp"
        title="Phân công nhân viên bếp"
        description="Chọn người phụ trách từng trạm để nhận thông báo món mới và điều phối chế biến."
      />
      <nav aria-label="Thiết lập bếp" className="mb-5 flex flex-wrap gap-3">
        {[
          ['/manager/kitchen-stations', 'Trạm bếp'],
          ['/manager/kitchen-stations/items', 'Phân món cho trạm'],
          ['/manager/kitchen-stations/assignments', 'Phân công nhân viên'],
        ].map(([to, label]) => (
          <NavLink
            end
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      {!m.enabled ? (
        <Panel className="p-6">
          Cần đăng nhập tài khoản manager được gán nhà hàng để quản lý phân
          công.
        </Panel>
      ) : (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Tổng trạm', rows.length],
              ['Đã phân công', rows.filter((r) => r.assignment).length],
              [
                'Trạm hoạt động chưa có người',
                rows.filter((r) => r.isActive && !r.assignment).length,
              ],
            ].map(([label, value]) => (
              <Panel key={label} className="p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <strong className="mt-2 block text-2xl">
                  {loading || errors.length ? '—' : value}
                </strong>
              </Panel>
            ))}
          </div>
          <Panel>
            <div className="flex flex-wrap gap-3 p-4">
              <SearchField
                value={search}
                onChange={(value) => {
                  setSearch(value)
                  setPage(1)
                }}
                placeholder="Tìm trạm hoặc nhân viên…"
              />
              <select
                aria-label="Tình trạng phân công"
                className={`${inputClass} sm:w-52`}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Tất cả phân công</option>
                <option value="assigned">Đã phân công</option>
                <option value="unassigned">Chưa phân công</option>
              </select>
              <button
                type="button"
                className={buttonClass}
                disabled={refreshing || m.mutation.isPending}
                onClick={() => void m.refresh()}
              >
                {refreshing ? 'Đang tải…' : 'Làm mới'}
              </button>
            </div>
            {notice && (
              <p role="status" className="px-4 pb-4 text-sm text-emerald-700">
                {notice}
              </p>
            )}
            {errors.length > 0 ? (
              <div role="alert" className="space-y-2 p-5 text-sm text-rose-700">
                {[...new Set(errors)].map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : loading ? (
              <p role="status" className="p-6 text-sm">
                Đang tải phân công bếp…
              </p>
            ) : !filtered.length ? (
              <p className="p-8 text-center text-sm text-slate-500">
                {rows.length
                  ? 'Không có trạm phù hợp bộ lọc.'
                  : 'Chưa có trạm bếp. Hãy tạo trạm trước khi phân công.'}
              </p>
            ) : (
              <>
                <AssignmentTable
                  rows={filtered.slice(
                    (currentPage - 1) * ASSIGNMENT_PAGE_SIZE,
                    currentPage * ASSIGNMENT_PAGE_SIZE,
                  )}
                  disabled={m.mutation.isPending || refreshing}
                  onEdit={(row) => open(row, false)}
                  onRemove={(row) => open(row, true)}
                />
                <Pagination
                  total={filtered.length}
                  page={currentPage}
                  size={ASSIGNMENT_PAGE_SIZE}
                  onPage={setPage}
                />
              </>
            )}
          </Panel>
        </>
      )}
      {target && (
        <Modal
          title={
            target.remove
              ? 'Gỡ phân công bếp?'
              : target.row.assignment
                ? 'Đổi người phụ trách'
                : 'Phân công nhân viên'
          }
          onClose={() => {
            if (!m.mutation.isPending) setTarget(null)
          }}
        >
          {target.remove ? (
            <div className="space-y-4 p-6">
              <p>
                Gỡ {employeeName(target.row.assignment?.employee)} khỏi trạm{' '}
                {target.row.kitchenStationName}?
              </p>
              <p className="text-sm text-slate-500">
                Chỉ gỡ được khi trạm không còn món chờ hoặc đang chế biến. Trạm
                chưa có người sẽ chưa nhận được thông báo món mới cho người phụ
                trách.
              </p>
              {m.mutation.isError && (
                <p role="alert" className="text-sm text-rose-700">
                  {assignmentError(m.mutation.error)}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className={buttonClass}
                  disabled={m.mutation.isPending}
                  onClick={() => setTarget(null)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className={primaryClass}
                  disabled={m.mutation.isPending}
                  onClick={() => {
                    if (target.row.assignment)
                      m.mutation.mutate({
                        kind: 'remove',
                        stationId: target.row.kitchenStationId,
                        expectedUserId: target.row.assignment.userId,
                      })
                  }}
                >
                  {m.mutation.isPending ? 'Đang gỡ…' : 'Gỡ phân công'}
                </button>
              </div>
            </div>
          ) : (
            <AssignmentForm
              row={target.row}
              employees={m.employees.data || []}
              pending={m.mutation.isPending}
              error={
                m.mutation.isError
                  ? assignmentError(m.mutation.error)
                  : undefined
              }
              onClose={() => setTarget(null)}
              onSave={(userId) =>
                m.mutation.mutate({
                  kind: 'save',
                  stationId: target.row.kitchenStationId,
                  userId,
                  expectedUserId: target.row.assignment?.userId,
                })
              }
            />
          )}
        </Modal>
      )}
    </>
  )
}
