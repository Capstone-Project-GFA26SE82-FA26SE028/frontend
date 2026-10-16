import { auditPresentation } from '../auditPresentation'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import type { AdminOutletContext } from '../../../../layouts/admin/AdminLayout'
import { Modal } from '../../../../components/Modal/Modal'
import {
  PageHeading,
  Panel,
  EmptyState,
  Pagination,
  SearchField,
  fieldClass,
  secondaryButton,
} from '../../components/AdminUI'
import { dateTime, downloadCsv, matches } from '../../utils'
import { ActivityDateFilter } from '../components/ActivityDateFilter'
import { inRange, type ActivityDateRange } from '../utils'

const entities: Record<string, string> = {
  restaurant: 'Nhà hàng',
  user: 'Người dùng',
  application: 'Đăng ký nhà hàng',
  plan: 'Gói dịch vụ',
  coupon: 'Mã giảm giá',
  payment: 'Thanh toán',
  verification: 'Xác minh nhà hàng',
  settings: 'Cấu hình nền tảng',
}
export function ActivityPage() {
  const audit = useAppSelector((s) => s.admin.audit)
  const { query: globalQuery } = useOutletContext<AdminOutletContext>()
  const [query, setQuery] = useState('')
  const [entity, setEntity] = useState('all')
  const [range, setRange] = useState<ActivityDateRange>({ from: '', to: '' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState('')
  const rows = audit
    .filter(
      (a) =>
        inRange(a.time, range) &&
        (entity === 'all' || (a.entity || 'other') === entity) &&
        matches(query, a.action, a.target, a.reason, a.actor || '') &&
        matches(globalQuery, a.action, a.target, a.reason, a.actor || ''),
    )
    .sort((a, b) => b.time.localeCompare(a.time))
  const current = Math.min(page, Math.max(1, Math.ceil(rows.length / 6)))
  const detail = audit.find((a) => a.id === selected)
  return (
    <>
      <PageHeading
        title="Nhật ký hoạt động"
        description="Tra cứu các thao tác đã ghi nhận trong bản xem trước trên trình duyệt này."
        action={
          <button
            className={secondaryButton}
            disabled={!rows.length}
            onClick={() =>
              downloadCsv(
                'nhat-ky-nen-tang',
                [
                  'Thời gian',
                  'Người thực hiện',
                  'Hành động',
                  'Đối tượng',
                  'Chi tiết',
                ],
                rows.map((a) => [
                  a.time,
                  auditPresentation(a).actor,
                  auditPresentation(a).label,
                  a.target,
                  auditPresentation(a).detail,
                ]),
              )
            }
          >
            Xuất nhật ký CSV
          </button>
        }
      />
      <ActivityDateFilter
        range={range}
        onChange={(r) => {
          setRange(r)
          setPage(1)
        }}
      />
      <Panel>
        <div className="flex flex-col gap-3 p-4 sm:flex-row">
          <SearchField
            value={query}
            onChange={(v) => {
              setQuery(v)
              setPage(1)
            }}
            placeholder="Tìm thao tác, đối tượng, lý do…"
          />
          <select
            aria-label="Nhóm nhật ký"
            className={`${fieldClass} sm:w-56`}
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value)
              setPage(1)
            }}
          >
            <option value="all">Tất cả nhóm</option>
            {Object.entries(entities).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed text-left text-sm">
            <caption className="sr-only">
              Nhật ký hoạt động, mới nhất trước
            </caption>
            <colgroup>
              <col className="w-[17%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[21%]" />
              <col className="w-[32%]" />
            </colgroup>
            <thead className="border-y border-slate-100 bg-slate-50 text-slate-500">
              <tr>
                {[
                  'Thời gian',
                  'Người thực hiện',
                  'Hành động',
                  'Đối tượng',
                  'Chi tiết',
                ].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3.5 font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice((current - 1) * 6, current * 6).map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-emerald-50/40"
                >
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">
                    <time dateTime={a.time}>{dateTime(a.time)}</time>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {auditPresentation(a).actor}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={
                        'inline-block rounded-md px-2 py-0.5 text-xs font-medium ' +
                        auditPresentation(a).tone
                      }
                    >
                      {auditPresentation(a).label}
                    </span>
                  </td>
                  <td className="break-words px-4 py-2.5 text-slate-700">
                    {a.target}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      className="text-left text-sm leading-6 text-slate-600 hover:text-emerald-700 hover:underline"
                      aria-label={
                        'Xem chi tiết: ' + a.action + ' — ' + a.target
                      }
                      onClick={() => setSelected(a.id)}
                    >
                      {auditPresentation(a).detail}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <EmptyState
            title="Chưa có nhật ký phù hợp"
            description="Các thay đổi tài khoản và cấu hình nhà hàng sẽ được ghi lại tại đây."
          />
        )}
        <Pagination total={rows.length} page={current} onPage={setPage} />
      </Panel>
      {detail && (
        <Modal title="Chi tiết nhật ký" onClose={() => setSelected('')}>
          <dl className="space-y-4 p-6">
            {[
              ['Người thực hiện', auditPresentation(detail).actor],
              ['Thao tác', detail.action],
              ['Đối tượng', detail.target],
              ['Thời gian', dateTime(detail.time)],
              ['Nhóm', entities[detail.entity || ''] || 'Khác'],
              ['Lý do / ghi chú', detail.reason || 'Không có ghi chú'],
              ['Mã nhật ký', detail.id],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="mt-1 break-words text-base">{value}</dd>
              </div>
            ))}
          </dl>
        </Modal>
      )}
    </>
  )
}
