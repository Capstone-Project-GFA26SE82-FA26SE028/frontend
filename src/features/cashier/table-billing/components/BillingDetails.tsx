import type { BillingEntry, BillingTab } from '../types/types'
import { money, STATUS_NAMES, tableName } from '../utils/billingDisplay'

export function BillingDetails({
  selected,
  tab,
}: {
  selected: BillingEntry | undefined
  tab: BillingTab
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="break-words text-lg font-bold">
          {selected ? tableName(selected) : 'Hóa đơn'}
        </h2>
        {selected && (
          <p className="mt-1 text-sm text-slate-500">
            {selected.tables
              .map((table) => table.areaName)
              .filter((name, index, values) => values.indexOf(name) === index)
              .join(' · ')}
          </p>
        )}
      </header>
      {selected ? (
        <dl className="space-y-4 break-words p-5 text-sm">
          <div>
            <dt className="text-slate-500">Trạng thái</dt>
            <dd>{STATUS_NAMES[selected.status] ?? selected.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Mã hóa đơn</dt>
            <dd>{selected.billCode ?? 'Chưa lập hóa đơn'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">
              {tab === 'paid' ? 'Thanh toán lúc' : 'Gửi yêu cầu lúc'}
            </dt>
            <dd>
              {(tab === 'paid' ? selected.paidAt : selected.submittedAt)
                ? new Date(
                    (tab === 'paid' ? selected.paidAt : selected.submittedAt)!,
                  ).toLocaleString('vi-VN')
                : 'Chưa ghi nhận'}
            </dd>
          </div>
          {selected.totalAmount !== null && (
            <div>
              <dt className="text-slate-500">Tổng tiền</dt>
              <dd className="text-xl font-bold text-emerald-800">
                {money.format(selected.totalAmount)}
              </dd>
            </div>
          )}
        </dl>
      ) : (
        <p className="p-5 text-sm text-slate-500">
          Chọn thẻ bàn để xem thông tin hóa đơn.
        </p>
      )}
    </section>
  )
}
