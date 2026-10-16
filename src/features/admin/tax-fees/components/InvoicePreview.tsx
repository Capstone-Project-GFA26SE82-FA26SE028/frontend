import { Panel } from '../../components/AdminUI'
import type { Fees } from '../schema'
export function InvoicePreview({ draft }: { draft: Partial<Fees> }) {
  const service =
    (500000 * (draft.serviceEnabled ? Number(draft.service) || 0 : 0)) / 100
  const vat = ((500000 + service) * (Number(draft.vat) || 0)) / 100
  const money = (n: number) => n.toLocaleString('vi-VN') + ' đ'
  return (
    <Panel className="p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Xem trước cấu hình mới
      </div>
      <h2 className="mb-1 mt-3 text-lg font-semibold text-slate-900">
        Hóa đơn minh họa
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Cập nhật theo thông tin đang nhập.
      </p>
      <dl className="space-y-4 text-sm">
        {[
          ['Tiền món', 500000],
          [
            'Phí dịch vụ' +
              (draft.serviceEnabled
                ? ' (' + (draft.service || 0) + '%)'
                : ' (không thu)'),
            service,
          ],
          ['VAT (' + (draft.vat || 0) + '%)', vat],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-slate-600">{label}</dt>
            <dd className="whitespace-nowrap font-medium tabular-nums text-slate-800">
              {money(Number(value))}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 border-t border-dashed border-slate-200 pt-5">
        <p className="text-sm text-slate-600">Tổng thanh toán</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-800">
          {money(500000 + service + vat)}
        </p>
      </div>
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">
        Ví dụ chưa có giảm giá. VAT tính trên tiền món cộng phí dịch vụ; cần
        thống nhất quy tắc với BE trước khi áp dụng thực tế.
      </p>
    </Panel>
  )
}
