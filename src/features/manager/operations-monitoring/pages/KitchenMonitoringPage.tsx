import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Field,
  fieldClass,
  PageHeading,
  Pagination,
  SearchField,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { matches } from '../../../admin/utils'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { dateLabel } from '../../menu-management/utils/price'
import { OperationsTabs } from '../components/OperationsTabs'
import { OperationsRefresh } from '../components/OperationsRefresh'
import {
  useKitchenTasks,
  useMonitoringClock,
  useOperationsTables,
} from '../hooks/useOperations'
import { isDelayed, waitingMinutes, withinDays } from '../utils/operations'
import type { KitchenTask } from '../types/operations'

const taskLabels: Record<string, string> = {
  Pending: 'Đang chờ',
  Cooking: 'Đang nấu',
  Ready: 'Đã xong',
  Cancelled: 'Đã hủy',
}

export function KitchenMonitoringPage() {
  const tasks = useKitchenTasks()
  const tables = useOperationsTables()
  const [params, setParams] = useSearchParams()
  const tableId = params.get('tableId') || ''
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [station, setStation] = useState('')
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [delayedOnly, setDelayedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<KitchenTask | null>(null)
  const now = useMonitoringClock()
  const all = tasks.data || []
  const tableName = (id: string) =>
    tables.data?.find((table) => table.tableId === id)?.tableCode ||
    id ||
    'Chưa phân công'
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
    Math.max(1, Math.ceil(visible.length / 10)),
  )
  const detail = all.find((task) => task.taskId === selected?.taskId)
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi vận hành"
        title="Tiến độ bếp"
        description="Theo dõi từng tác vụ bếp và xác định các món đang chờ quá 15 phút."
      />
      <OperationsTabs />
      <QueryState
        pending={tasks.isPending}
        error={tasks.error}
        retry={() => void tasks.refetch()}
      >
        <SummaryCards
          items={[
            {
              label: 'Đang chờ',
              value: all.filter((task) => task.status === 'Pending').length,
              icon: 'clock',
              note: 'Tác vụ đang chờ chế biến',
            },
            {
              label: 'Đang nấu',
              value: all.filter((task) => task.status === 'Cooking').length,
              icon: 'fire',
              note: 'Tác vụ đang chế biến',
            },
            {
              label: 'Đã xong',
              value: all.filter((task) => task.status === 'Ready').length,
              icon: 'check',
              note: 'Tác vụ bếp đã hoàn thành',
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
          refreshing={tasks.isFetching}
          refresh={() => void tasks.refetch()}
        />
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
                className={`${fieldClass} sm:w-44`}
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
                className={`${fieldClass} sm:w-52`}
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
              <Field label="Từ ngày (UTC+7)">
                <input
                  type="date"
                  max={until || undefined}
                  className={fieldClass}
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
                  className={fieldClass}
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
                  className={secondaryButton}
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
                    .slice((currentPage - 1) * 10, currentPage * 10)
                    .map((task) => (
                      <tr
                        key={task.taskId}
                        className={isDelayed(task, now) ? 'bg-amber-50/60' : ''}
                      >
                        <td>
                          <p className="font-semibold">{task.orderNumber}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {tableName(task.tableId)}
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
                              Chậm
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap">
                          {waitingMinutes(task, now)} phút
                        </td>
                        <td className="whitespace-nowrap text-xs">
                          {dateLabel(task.queuedAt)}
                        </td>
                        <td>
                          <button
                            className={secondaryButton}
                            onClick={() => setSelected(task)}
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
            size={10}
            onPage={setPage}
          />
        </Panel>
      </QueryState>
      {selected && (
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
                <dl className="space-y-3 text-sm">
                  {[
                    ['Vào hàng chờ', detail.queuedAt],
                    ['Bắt đầu nấu', detail.cookingAt],
                    ['Đã xong', detail.readyAt],
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
