import { Pagination } from '../../../../components/Pagination/Pagination'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { dateTime } from '../../utils'
import type { FeeVersion } from '../types/types'
export function FeeHistoryTable({
  fees,
  currentId,
  now,
  page,
  total,
  onPage,
  busy,
  currentReady,
}: {
  fees: FeeVersion[]
  currentId?: string
  now: number
  page: number
  total: number
  onPage: (page: number) => void
  busy: boolean
  currentReady: boolean
}) {
  return (
    <Panel className="mt-4 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3.5 sm:px-5">
        <h2 className="text-base font-semibold">Lịch sử cấu hình</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs tabular-nums text-slate-500">
          {total}
        </span>
      </div>
      <fieldset disabled={busy} aria-busy={busy} className="min-w-0">
        <div
          className={
            'overflow-x-auto transition-opacity ' + (busy ? 'opacity-60' : '')
          }
        >
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
                    {busy
                      ? 'Đang tải lịch sử…'
                      : 'Chưa có cấu hình VAT và phí dịch vụ.'}
                  </td>
                </tr>
              )}
              {fees.map((f) => (
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
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {f.vat}%
                  </td>
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
                          : currentReady
                            ? 'Đã thay thế'
                            : '—'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={total} page={page} onPage={onPage} />
      </fieldset>
    </Panel>
  )
}
