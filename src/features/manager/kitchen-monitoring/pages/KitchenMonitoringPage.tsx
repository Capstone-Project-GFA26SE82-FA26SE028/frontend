import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'

import { SearchField } from '../../../../components/SearchField/SearchField'
import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { Field } from '../../../../components/Field/Field'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { QueryState } from '../components/QueryState'
import { tableClass } from '../constants/styles'
import { dateLabel } from '../utils/price'
import { OperationsTabs } from '../components/OperationsTabs'
import { OperationsRefresh } from '../components/OperationsRefresh'
import {
  useKitchenTasks,
  useOperationsTables,
  useKitchenSummary,
} from '../hooks/useKitchenTasks'
import { useMonitoringClock } from '../hooks/useMonitoringClock'
import {
  isDelayed,
  isLate,
  matches,
  waitingMinutes,
  withinDays,
} from '../utils/operations'
import { kitchenError } from '../api/kitchenApi'

const taskLabels: Record<string, string> = {
  Pending: 'Đang chờ',
  Cooking: 'Đang nấu',
  Ready: 'Đã xong',
  Cancelled: 'Đã hủy',
}

export function KitchenMonitoringPage() {
  const tasks = useKitchenTasks()
  const tables = useOperationsTables()
  const summary = useKitchenSummary()
  const [params, setParams] = useSearchParams()
  const tableId = params.get('tableId') || ''
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [station, setStation] = useState('')
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [delayedOnly, setDelayedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<{
    taskId: string
    scope: string
  } | null>(null)
  const now = useMonitoringClock()
  const all = tasks.data || []
  const tableName = (id: string) =>
    tables.data?.find((table) => table.tableId === id)?.tableCode ||
    id ||
    'Mang đi / không có bàn'
  const visible = all.filter(
    (task) =>
      matches(
        search,
        task.orderNumber,
        task.itemName,
        tableName(task.tableId),
      ) &&
      (!status || task.status === status) &&
      (!station || task.stationId === station) &&
      (!tableId || task.tableId === tableId) &&
      withinDays(task.queuedAt, from, until) &&
      (!delayedOnly || isDelayed(task, now)),
  )
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(visible.length / PAGE_SIZE)),
  )
  const selection = selected?.scope === tasks.scope ? selected : null
  const detail = all.find((task) => task.taskId === selection?.taskId)
  const refresh = () => {
    void tasks.refetch()
    void tables.refetch()
    void summary.refetch()
  }
  if (!tasks.restaurantId)
    return (
      <PageHeading
        title="Tiến độ bếp"
        description="Bạn cần được phân công nhà hàng để xem tiến độ bếp."
      />
    )
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi vận hành"
        title="Tiến độ bếp"
        description="Theo dõi tiến độ chế biến, thời gian chờ và món trễ hạn trong nhà hàng."
      />
      <OperationsTabs />
      <QueryState pending={tasks.isPending} error={tasks.error} retry={refresh}>
        <SummaryCards
          items={[
            {
              label: 'Đang chờ',
              value:
                summary.data && !summary.isError
                  ? summary.data.pendingCount
                  : '—',
              icon: 'clock',
              note: 'Tác vụ đang chờ chế biến',
            },
            {
              label: 'Đang nấu',
              value:
                summary.data && !summary.isError
                  ? summary.data.cookingCount
                  : '—',
              icon: 'fire',
              note: 'Tác vụ đang chế biến',
            },
            {
              label: 'Đã xong',
              value:
                summary.data && !summary.isError
                  ? summary.data.readyCount
                  : '—',
              icon: 'check',
              note: 'Món đã xong, chưa phục vụ',
            },
            {
              label: 'Chờ > 15 phút',
              value: all.filter((task) => isDelayed(task, now)).length,
              icon: 'bell',
              note: 'Chỉ tác vụ đang chờ; trên toàn bộ dữ liệu đã tải',
            },
          ]}
        />
        <OperationsRefresh
          updatedAt={tasks.dataUpdatedAt}
          refreshing={
            tasks.isFetching || tables.isFetching || summary.isFetching
          }
          refresh={refresh}
        />
        {summary.isError ? (
          <p role="alert" className="mb-4 text-sm text-rose-700">
            Không thể tải thống kê bếp: {kitchenError(summary.error)}
          </p>
        ) : (
          <p className="mb-4 text-sm text-slate-500">
            Thời gian nấu trung bình:{' '}
            {summary.data
              ? `${summary.data.avgCookingTimeMinutes.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} phút`
              : 'Đang tải…'}
            . Thống kê trên toàn bộ nhà hàng; bộ lọc bên dưới áp dụng cho danh
            sách.
          </p>
        )}
        {tables.isError && (
          <p role="alert" className="mb-4 text-sm text-amber-700">
            Chưa tải được tên bàn: {kitchenError(tables.error)} Danh sách tạm
            hiển thị mã bàn.
          </p>
        )}
        <Panel>
          <div className="space-y-3 border-b border-slate-100 p-4">
            <div className="flex flex-wrap gap-3">
              <SearchField
                value={search}
                onChange={(value) => {
                  setSearch(value)
                  setPage(1)
                }}
                placeholder="Tìm đơn, bàn hoặc món…"
              />
              <select
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-44"
                aria-label="Trạng thái tác vụ"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(taskLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-52"
                aria-label="Trạm bếp"
                value={station}
                onChange={(e) => {
                  setStation(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Tất cả trạm</option>
                {[
                  ...new Map(
                    all.map((task) => [task.stationId, task.stationName]),
                  ),
                ].map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Bàn">
                <select
                  aria-label="Lọc theo bàn"
                  value={tableId}
                  disabled={tables.isPending || tables.isError}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-40"
                  onChange={(event) => {
                    const next = new URLSearchParams(params)
                    if (event.target.value)
                      next.set('tableId', event.target.value)
                    else next.delete('tableId')
                    setParams(next)
                    setPage(1)
                  }}
                >
                  <option value="">Tất cả bàn / mang đi</option>
                  {tableId &&
                    !tables.data?.some(
                      (table) => table.tableId === tableId,
                    ) && <option value={tableId}>{tableName(tableId)}</option>}
                  {tables.data?.map((table) => (
                    <option key={table.tableId} value={table.tableId}>
                      {table.tableCode}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Từ ngày (UTC+7)">
                <input
                  type="date"
                  max={until || undefined}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    setPage(1)
                  }}
                />
              </Field>
              <Field label="Đến ngày (UTC+7)">
                <input
                  type="date"
                  min={from || undefined}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  value={until}
                  onChange={(e) => {
                    setUntil(e.target.value)
                    setPage(1)
                  }}
                />
              </Field>
              <label className="flex min-h-11 items-center gap-2 self-end text-sm">
                <input
                  type="checkbox"
                  checked={delayedOnly}
                  onChange={(e) => {
                    setDelayedOnly(e.target.checked)
                    setPage(1)
                  }}
                />
                Chờ quá 15 phút
              </label>
            </div>
            {tableId && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span>Đang lọc bàn: {tableName(tableId)}</span>
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                  onClick={() => setParams({})}
                >
                  Bỏ lọc bàn
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500">
              Một tác vụ đã xong không có nghĩa mọi món trong đơn đã xong. Màn
              hình theo dõi của quản lý không thay đổi trạng thái chế biến.
            </p>
          </div>
          <QueryState
            pending={false}
            error={null}
            retry={() => void tasks.refetch()}
            empty={!visible.length}
          >
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-slate-50">
                  <tr>
                    <th>Đơn / Bàn</th>
                    <th>Món</th>
                    <th>Trạm</th>
                    <th>Trạng thái tác vụ</th>
                    <th>Thời gian chờ</th>
                    <th>Vào hàng chờ lúc (UTC+7)</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible
                    .slice(
                      (currentPage - 1) * PAGE_SIZE,
                      currentPage * PAGE_SIZE,
                    )
                    .map((task) => (
                      <tr
                        key={task.taskId}
                        className={
                          isDelayed(task, now) || isLate(task, now)
                            ? 'bg-amber-50/60'
                            : ''
                        }
                      >
                        <td>
                          <p className="font-semibold">{task.orderNumber}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {task.channel === 'Takeaway'
                              ? 'Mang đi'
                              : tableName(task.tableId)}
                          </p>
                        </td>
                        <td>
                          <p className="min-w-40 font-medium">
                            {task.itemName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Số lượng: {task.quantity}
                          </p>
                        </td>
                        <td>{task.stationName}</td>
                        <td>
                          <Badge
                            tone={
                              task.status === 'Ready'
                                ? 'green'
                                : task.status === 'Cooking'
                                  ? 'blue'
                                  : task.status === 'Cancelled'
                                    ? 'slate'
                                    : 'amber'
                            }
                          >
                            {taskLabels[task.status] || task.status}
                          </Badge>
                          {isDelayed(task, now) && (
                            <p className="mt-2 text-xs font-semibold text-amber-700">
                              Chờ quá 15 phút
                            </p>
                          )}
                          {isLate(task, now) && (
                            <p className="mt-2 text-xs font-semibold text-rose-700">
                              Trễ hạn dự kiến
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap">
                          {task.status === 'Cancelled' &&
                          !task.cookingAt &&
                          !task.readyAt
                            ? 'Không có dữ liệu'
                            : `${waitingMinutes(task, now)} phút`}
                        </td>
                        <td className="whitespace-nowrap text-xs">
                          {dateLabel(task.queuedAt)}
                        </td>
                        <td>
                          <button
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                            onClick={() =>
                              setSelected({
                                taskId: task.taskId,
                                scope: tasks.scope,
                              })
                            }
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </QueryState>
          <Pagination
            locale="vi"
            total={visible.length}
            page={currentPage}
            onPage={setPage}
          />
        </Panel>
      </QueryState>
      {selection && !tasks.isError && (
        <Modal
          title="Chi tiết tác vụ bếp"
          closeLabel="Đóng"
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4 p-6">
            {detail ? (
              <>
                <h2 className="font-semibold">
                  {detail.itemName} × {detail.quantity}
                </h2>
                <p className="text-sm">
                  Đơn: {detail.orderNumber} · Bàn: {tableName(detail.tableId)}
                </p>
                <p className="text-sm">Trạm: {detail.stationName}</p>
                <Badge tone={detail.status === 'Ready' ? 'green' : 'blue'}>
                  {taskLabels[detail.status] || detail.status}
                </Badge>
                <p className="text-sm">
                  Dự kiến:{' '}
                  {detail.estimatedMinutes == null
                    ? 'Chưa thiết lập'
                    : `${detail.estimatedMinutes} phút`}
                </p>
                {detail.note && (
                  <p className="whitespace-pre-wrap text-sm">
                    Ghi chú: {detail.note}
                  </p>
                )}
                {!!detail.options.length && (
                  <ul className="space-y-1 text-sm">
                    {detail.options.map((option) => (
                      <li key={option.optionId}>
                        {option.name} × {option.quantity}
                      </li>
                    ))}
                  </ul>
                )}
                <dl className="space-y-3 text-sm">
                  {[
                    ['Vào hàng chờ', detail.queuedAt],
                    ['Bắt đầu nấu', detail.cookingAt],
                    ['Đã xong', detail.readyAt],
                    ['Hạn dự kiến', detail.dueAt],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3">
                      <dt className="text-slate-500">{label}</dt>
                      <dd>{value ? dateLabel(value) : 'Chưa ghi nhận'}</dd>
                    </div>
                  ))}
                </dl>
                <p className="break-all text-xs text-slate-400">
                  Mã tác vụ: {detail.taskId}
                </p>
              </>
            ) : (
              <p>Tác vụ này không còn trong dữ liệu mới nhất.</p>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
