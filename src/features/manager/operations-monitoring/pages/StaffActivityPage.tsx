import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'

import { SearchField } from '../../../../components/SearchField/SearchField'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { Field } from '../../../../components/Field/Field'
import { Panel } from '../../../../components/Panel/Panel'
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
  OPEN_TABLE: 'Mở bàn',
  MERGE_TABLE: 'Gộp bàn',
  CANCEL_ITEM: 'Hủy món',
  MANUAL_DISCOUNT: 'Giảm giá thủ công',
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
    Math.max(1, Math.ceil(visible.length / PAGE_SIZE)),
  )
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi vận hành"
        title="Hoạt động nhân viên"
        description="Xem trước thao tác nhân viên, lý do và dữ liệu trước/sau trong nhật ký chỉ đọc."
      />
      <OperationsTabs />
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <h2 className="font-semibold">Xem trước hoạt động vận hành</h2>
        <p className="mt-1">
          Các ví dụ dưới đây minh họa mở bàn, gộp bàn, hủy món và giảm giá thủ
          công. Đây là dữ liệu mẫu, không phải thao tác thực tế tại nhà hàng của
          bạn.
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
                placeholder="Tìm nhân viên, bàn, đơn hoặc thao tác…"
              />
              <select
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-60"
                aria-label="Loại hoạt động"
                value={action}
                onChange={(e) => {
                  setAction(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Tất cả loại thao tác</option>
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Từ ngày (UTC+7)">
                <input
                  type="date"
                  max={until || undefined}
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    setPage(1)
                  }}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </Field>
              <Field label="Đến ngày (UTC+7)">
                <input
                  type="date"
                  min={from || undefined}
                  value={until}
                  onChange={(e) => {
                    setUntil(e.target.value)
                    setPage(1)
                  }}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                    <th>Ghi nhận lúc (UTC+7)</th>
                    <th>Nhân viên / Bàn / Đơn</th>
                    <th>Thao tác</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible
                    .slice(
                      (currentPage - 1) * PAGE_SIZE,
                      currentPage * PAGE_SIZE,
                    )
                    .map((record) => (
                      <tr key={record.auditLogId}>
                        <td className="whitespace-nowrap">
                          {dateLabel(record.createdAt)}
                        </td>
                        <td className="break-all text-sm">
                          {record.employeeName ||
                            record.userId ||
                            'Chưa ghi nhận'}
                          <p className="mt-1 text-xs text-slate-400">
                            {record.tableCode} · {record.orderNumber}
                          </p>
                        </td>
                        <td>
                          {labels[record.action || ''] ||
                            record.action ||
                            'Chưa xác định'}
                        </td>
                        <td className="break-all text-xs text-slate-400">
                          <button
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                            onClick={() => setSelected(record)}
                          >
                            Xem chi tiết
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
      {selected && (
        <Modal
          title="Chi tiết hoạt động · Dữ liệu mẫu"
          closeLabel="Đóng"
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
              <h3 className="text-sm font-semibold">Lý do</h3>
              <p className="mt-1 text-sm text-slate-500">
                {selected.reason || 'Chưa ghi nhận'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Trước</h3>
              <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm">
                {selected.beforeValue || 'Chưa ghi nhận'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Sau</h3>
              <p className="mt-1 rounded-xl bg-emerald-50 p-3 text-sm">
                {selected.afterValue || 'Chưa ghi nhận'}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
