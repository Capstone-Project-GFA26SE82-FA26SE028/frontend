import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { dateTime } from '../../utils'
import type { FeeVersion } from '../types/types'
import { useState } from 'react'
export function FeeHistoryTable({
  fees,
  currentId,
  now,
}: {
  fees: FeeVersion[]
  currentId?: string
  now: number
}) {
  const [selectedPage, setPage] = useState(1)
  const pageSize = 10
  const pages = Math.max(1, Math.ceil(fees.length / pageSize))
  const page = Math.min(selectedPage, pages)
  const visible = fees.slice((page - 1) * pageSize, page * pageSize)
  return (
    <Panel className="mt-4 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3.5 sm:px-5">
        <h2 className="text-base font-semibold">Lịch sử cấu hình</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs tabular-nums text-slate-500">
          {fees.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-y border-slate-100 bg-slate-50 text-slate-600">
            <tr>
              {[
                'Phiên bản',
                'Hiệu lực từ',
                'VAT',
                'Phí dịch vụ',
                'Trạng thái',
              ].map((x) => (
                <th
                  key={x}
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium"
                >
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!fees.length && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Chưa có cấu hình VAT và phí dịch vụ.
                </td>
              </tr>
            )}
            {visible.map((f) => (
              <tr
                key={f.id}
                className={
                  'border-t border-slate-100 transition-colors hover:bg-slate-50/70 ' +
                  (currentId === f.id ? 'bg-emerald-50/40' : '')
                }
              >
                <td className="px-4 py-3 font-medium text-slate-500">
                  V{f.version}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                  {dateTime(f.effectiveAt)}
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">{f.vat}%</td>
                <td className="px-4 py-3 tabular-nums">
                  {f.serviceEnabled ? f.service + '%' : 'Không thu'}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      Date.parse(f.effectiveAt) > now
                        ? 'amber'
                        : currentId === f.id
                          ? 'green'
                          : 'slate'
                    }
                  >
                    {Date.parse(f.effectiveAt) > now
                      ? 'Chờ hiệu lực'
                      : currentId === f.id
                        ? 'Đang áp dụng'
                        : 'Đã thay thế'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm">
          <span className="text-slate-500">
            Trang {page}/{pages} · {pageSize} phiên bản/trang
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40"
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </Panel>
  )
}
