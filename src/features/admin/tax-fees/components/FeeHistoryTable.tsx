import { Panel, Badge } from '../../components/AdminUI'
import { dateTime } from '../../utils'
import type { FeeVersion } from '../schema'
export function FeeHistoryTable({
  fees,
  currentId,
  now,
}: {
  fees: FeeVersion[]
  currentId?: string
  now: number
}) {
  return (
    <Panel className="mt-5 overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-5">
        <h2 className="text-lg font-semibold">Lịch sử cấu hình</h2>
        <span className="text-sm text-slate-500">{fees.length} phiên bản</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed text-left text-sm">
          <thead className="border-y border-slate-100 bg-slate-50 text-slate-600">
            <tr>
              {['Hiệu lực từ', 'VAT', 'Phí dịch vụ', 'Trạng thái'].map((x) => (
                <th key={x} scope="col" className="p-4 font-semibold">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...fees]
              .sort(
                (a, b) => Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt),
              )
              .map((f) => (
                <tr key={f.id} className="border-t border-slate-100">
                  <td className="p-4">{dateTime(f.effectiveAt)}</td>
                  <td className="p-4">{f.vat}%</td>
                  <td className="p-4">
                    {f.serviceEnabled ? f.service + '%' : 'Không thu'}
                  </td>
                  <td className="p-4">
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
    </Panel>
  )
}
