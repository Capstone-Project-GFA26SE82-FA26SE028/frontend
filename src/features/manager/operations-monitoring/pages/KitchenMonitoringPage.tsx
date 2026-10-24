import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Badge,
  Field,
  fieldClass,
  PageHeading,
  Pagination,
  Panel,
  SearchField,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
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
import {
  isDelayed,
  taskLabels,
  waitingMinutes,
  withinDays,
} from '../utils/operations'
import type { KitchenTask } from '../types/operations'

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
    'Not assigned'
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
        eyebrow="Operations Monitoring"
        title="Kitchen Progress"
        description="Monitor each kitchen task independently and identify items waiting longer than 15 minutes."
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
              label: 'Waiting',
              value: all.filter((task) => task.status === 'Pending').length,
              icon: 'clock',
              note: 'Tasks waiting for preparation',
            },
            {
              label: 'Cooking',
              value: all.filter((task) => task.status === 'Cooking').length,
              icon: 'fire',
              note: 'Tasks currently being prepared',
            },
            {
              label: 'Ready',
              value: all.filter((task) => task.status === 'Ready').length,
              icon: 'check',
              note: 'Completed kitchen tasks',
            },
            {
              label: 'Waiting > 15 min',
              value: all.filter((task) => isDelayed(task, now)).length,
              icon: 'bell',
              note: 'Waiting tasks only; all loaded records',
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
                placeholder="Search order, table, or item…"
              />
              <select
                className={`${fieldClass} sm:w-44`}
                aria-label="Task status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All statuses</option>
                {Object.entries(taskLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className={`${fieldClass} sm:w-52`}
                aria-label="Kitchen station"
                value={station}
                onChange={(e) => {
                  setStation(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All stations</option>
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
              <Field label="From date (UTC+7)">
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
              <Field label="Until date (UTC+7)">
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
                Waiting more than 15 minutes
              </label>
            </div>
            {tableId && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span>Table filter: {tableName(tableId)}</span>
                <button
                  className={secondaryButton}
                  onClick={() => setParams({})}
                >
                  Clear table filter
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500">
              A ready task does not mean every item in its order is ready.
              Manager monitoring does not change preparation status.
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
                    <th>Order / Table</th>
                    <th>Item</th>
                    <th>Station</th>
                    <th>Task status</th>
                    <th>Queue wait</th>
                    <th>Queued at (UTC+7)</th>
                    <th>Details</th>
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
                            Quantity: {task.quantity}
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
                              Delayed
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap">
                          {waitingMinutes(task, now)} min
                        </td>
                        <td className="whitespace-nowrap text-xs">
                          {dateLabel(task.queuedAt)}
                        </td>
                        <td>
                          <button
                            className={secondaryButton}
                            onClick={() => setSelected(task)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </QueryState>
          <Pagination
            locale="en"
            total={visible.length}
            page={currentPage}
            size={10}
            onPage={setPage}
          />
        </Panel>
      </QueryState>
      {selected && (
        <Modal
          title="Kitchen task details"
          closeLabel="Close"
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4 p-6">
            {detail ? (
              <>
                <h2 className="font-semibold">
                  {detail.itemName} × {detail.quantity}
                </h2>
                <p className="text-sm">
                  Order: {detail.orderNumber} · Table:{' '}
                  {tableName(detail.tableId)}
                </p>
                <p className="text-sm">Station: {detail.stationName}</p>
                <dl className="space-y-3 text-sm">
                  {[
                    ['Queued', detail.queuedAt],
                    ['Cooking started', detail.cookingAt],
                    ['Ready', detail.readyAt],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3">
                      <dt className="text-slate-500">{label}</dt>
                      <dd>{value ? dateLabel(value) : 'Not recorded'}</dd>
                    </div>
                  ))}
                </dl>
                <p className="break-all text-xs text-slate-400">
                  Task ID: {detail.taskId}
                </p>
              </>
            ) : (
              <p>This task is no longer present in the latest data.</p>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
