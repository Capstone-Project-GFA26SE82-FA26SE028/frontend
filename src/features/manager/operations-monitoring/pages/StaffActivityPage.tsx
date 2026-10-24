import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Field,
  fieldClass,
  PageHeading,
  Pagination,
  Panel,
  SearchField,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { matches } from '../../../admin/utils'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { dateLabel } from '../../menu-management/utils/price'
import { OperationsTabs } from '../components/OperationsTabs'
import { OperationsRefresh } from '../components/OperationsRefresh'
import { useStaffActivity } from '../hooks/useOperations'
import { withinDays } from '../utils/operations'
import type { StaffActivity } from '../types/operations'

const labels: Record<string, string> = {
  OPEN_TABLE: 'Table opened',
  MERGE_TABLE: 'Tables merged',
  CANCEL_ITEM: 'Item cancelled',
  MANUAL_DISCOUNT: 'Manual discount',
}
export function StaffActivityPage() {
  const activity = useStaffActivity()
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<StaffActivity | null>(null)
  const visible = (activity.data || []).filter(
    (record) =>
      matches(
        search,
        record.userId || '',
        record.action || '',
        record.employeeName || '',
        record.tableCode || '',
        record.orderNumber || '',
      ) &&
      (!action || record.action === action) &&
      withinDays(record.createdAt, from, until),
  )
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(visible.length / 10)),
  )
  return (
    <>
      <PageHeading
        eyebrow="Operations Monitoring"
        title="Staff Activity"
        description="Preview staff operations, reasons, and before/after details in a read-only activity log."
      />
      <OperationsTabs />
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <h2 className="font-semibold">Operational activity preview</h2>
        <p className="mt-1">
          The examples below demonstrate table opening/merging, item
          cancellation, and manual discount review. They are sample records, not
          staff actions from your restaurant.
        </p>
      </div>
      <QueryState
        pending={activity.isPending}
        error={activity.error}
        retry={() => void activity.refetch()}
      >
        <OperationsRefresh
          updatedAt={activity.dataUpdatedAt}
          refreshing={activity.isFetching}
          refresh={() => void activity.refetch()}
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
                placeholder="Search employee, table, order, or action…"
              />
              <select
                className={`${fieldClass} sm:w-60`}
                aria-label="Activity type"
                value={action}
                onChange={(e) => {
                  setAction(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All operation types</option>
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="From date (UTC+7)">
                <input
                  type="date"
                  max={until || undefined}
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    setPage(1)
                  }}
                  className={fieldClass}
                />
              </Field>
              <Field label="Until date (UTC+7)">
                <input
                  type="date"
                  min={from || undefined}
                  value={until}
                  onChange={(e) => {
                    setUntil(e.target.value)
                    setPage(1)
                  }}
                  className={fieldClass}
                />
              </Field>
            </div>
          </div>
          <QueryState
            pending={false}
            error={null}
            retry={() => void activity.refetch()}
            empty={!visible.length}
          >
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-slate-50">
                  <tr>
                    <th>Recorded at (UTC+7)</th>
                    <th>Employee / Table / Order</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible
                    .slice((currentPage - 1) * 10, currentPage * 10)
                    .map((record) => (
                      <tr key={record.auditLogId}>
                        <td className="whitespace-nowrap">
                          {dateLabel(record.createdAt)}
                        </td>
                        <td className="break-all text-sm">
                          {record.employeeName ||
                            record.userId ||
                            'Not recorded'}
                          <p className="mt-1 text-xs text-slate-400">
                            {record.tableCode} · {record.orderNumber}
                          </p>
                        </td>
                        <td>
                          {labels[record.action || ''] ||
                            record.action ||
                            'Unknown'}
                        </td>
                        <td className="break-all text-xs text-slate-400">
                          <button
                            className={secondaryButton}
                            onClick={() => setSelected(record)}
                          >
                            View details
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
          title="Activity details · Sample record"
          closeLabel="Close"
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4 p-6">
            <p className="font-semibold">
              {labels[selected.action || ''] || selected.action}
            </p>
            <p className="text-sm">
              {selected.employeeName} · {dateLabel(selected.createdAt)}
            </p>
            <p className="text-sm">
              {selected.tableCode} · {selected.orderNumber}
            </p>
            <div>
              <h3 className="text-sm font-semibold">Reason</h3>
              <p className="mt-1 text-sm text-slate-500">
                {selected.reason || 'Not recorded'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Before</h3>
              <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm">
                {selected.beforeValue || 'Not recorded'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">After</h3>
              <p className="mt-1 rounded-xl bg-emerald-50 p-3 text-sm">
                {selected.afterValue || 'Not recorded'}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
