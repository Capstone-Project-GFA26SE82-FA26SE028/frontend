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
import { useDebounce } from '../../../../hooks/useDebounce'
import { QueryState } from '../components/QueryState'
import { tableClass } from '../constants/styles'
import { dateLabel } from '../utils/price'
import { OperationsTabs } from '../components/OperationsTabs'
import { OperationsRefresh } from '../components/OperationsRefresh'
import { useStaffActivity } from '../hooks/useStaffActivity'
import type { LiveStaffActivity } from '../api/staffActivityApi'

const labels: Record<string, string> = {
  AccountAudit: 'Nh?t k? t?i kho?n',
  ItemCancellation: 'Y?u c?u h?y m?n',
  BillAdjustment: '?i?u ch?nh h?a ??n',
}
export function StaffActivityPage() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<LiveStaffActivity | null>(null)
  const query = useDebounce(search, 300)
  const activity = useStaffActivity({
    page,
    pageSize: PAGE_SIZE,
    search: query.trim() || undefined,
    activityType: action || undefined,
    from: from ? from + 'T00:00:00+07:00' : undefined,
    to: until ? until + 'T23:59:59.9999999+07:00' : undefined,
  })
  const visible = activity.data?.items || []
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi vận hành"
        title="Hoạt động nhân viên"
        description="Xem trước thao tác nhân viên, lý do và dữ liệu trước/sau trong nhật ký chỉ đọc."
      />
      <OperationsTabs />
      {!activity.enabled && (
        <Panel className="mb-4 p-4">
          T?i kho?n c?n ???c g?n nh? h?ng ?? xem ho?t ??ng.
        </Panel>
      )}
      {activity.enabled && (
        <>
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
              pending={activity.isPending}
              error={activity.error}
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
                    {visible.map((record) => (
                      <tr key={record.activityId}>
                        <td className="whitespace-nowrap">
                          {dateLabel(record.timestamp)}
                        </td>
                        <td className="break-all text-sm">
                          {record.staffName || 'Chưa ghi nhận'}
                          <p className="mt-1 text-xs text-slate-400">
                            {record.target}
                          </p>
                        </td>
                        <td>{record.actionDescription}</td>
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
              total={activity.data?.totalCount || 0}
              page={page}
              onPage={setPage}
            />
          </Panel>
        </>
      )}
      {selected && (
        <Modal
          title="Chi tiết hoạt động"
          closeLabel="Đóng"
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4 p-6">
            <p className="font-semibold">{selected.actionDescription}</p>
            <p className="text-sm">
              {selected.staffName} · {dateLabel(selected.timestamp)}
            </p>
            <p className="text-sm">{selected.target}</p>
            <div>
              <h3 className="text-sm font-semibold">Lý do</h3>
              <p className="mt-1 text-sm text-slate-500">
                {selected.reason || 'Chưa ghi nhận'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Trước</h3>
              <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm">
                {selected.metadata?.oldValue || 'Chưa ghi nhận'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Sau</h3>
              <p className="mt-1 rounded-xl bg-emerald-50 p-3 text-sm">
                {selected.metadata?.newValue || 'Chưa ghi nhận'}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
