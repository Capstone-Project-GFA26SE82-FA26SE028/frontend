import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { dateTime } from '../../utils'
import type { FeeVersion } from '../types/types'
export function CurrentFees({ current }: { current?: FeeVersion }) {
  return (
    <Panel className="mb-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
        <h2 className="text-sm font-semibold text-slate-700">
          Mức đang áp dụng
        </h2>
        <Badge tone={current ? 'green' : 'slate'}>
          {current ? 'Đang áp dụng' : 'Chưa có cấu hình hiệu lực'}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3 px-5 pb-4 pt-3 sm:grid-cols-[1fr_1fr_1.3fr]">
        <div>
          <dt className="text-sm text-slate-500">Thuế VAT</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-emerald-800">
            {current ? current.vat + '%' : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Phí dịch vụ</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {current
              ? current.serviceEnabled
                ? current.service + '%'
                : 'Không thu'
              : '—'}
          </dd>
        </div>
        <div className="col-span-2 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:col-span-1 sm:block sm:border-t-0 sm:border-l sm:pl-5 sm:pt-0">
          <dt className="text-sm text-slate-500">Hiệu lực từ</dt>
          <dd className="text-sm font-medium text-slate-700 sm:mt-2">
            {current ? (
              <>
                <span className="mr-2 text-slate-400">V{current.version}</span>
                {dateTime(current.effectiveAt)}
              </>
            ) : (
              'Chưa thiết lập'
            )}
          </dd>
        </div>
      </dl>
    </Panel>
  )
}
