import { Panel, Badge } from '../../components/AdminUI'
import { dateTime } from '../../utils'
import type { FeeVersion } from '../schema'
export function CurrentFees({ current }: { current?: FeeVersion }) {
  return (
    <Panel className="mb-5 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-800">Mức thu hiện tại</h2>
        <Badge tone={current ? 'green' : 'slate'}>
          {current ? 'Đang áp dụng' : 'Chưa có cấu hình hiệu lực'}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <dt className="text-sm text-slate-500">Thuế VAT</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {current ? current.vat + '%' : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Phí dịch vụ</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {current
              ? current.serviceEnabled
                ? current.service + '%'
                : 'Không thu'
              : '—'}
          </dd>
        </div>
        <div className="col-span-2 border-t border-slate-100 pt-4 sm:col-span-1 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
          <dt className="text-sm text-slate-500">Hiệu lực từ</dt>
          <dd className="mt-2 text-base font-medium text-slate-700">
            {current ? dateTime(current.effectiveAt) : 'Chưa thiết lập'}
          </dd>
        </div>
      </dl>
    </Panel>
  )
}
