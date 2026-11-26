import { useQuery } from '@tanstack/react-query'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { getCashierBill } from '../api/billApi'
import type { BillingEntry, BillingTab } from '../types/types'
import { STATUS_NAMES, tableName } from '../utils/billingDisplay'
import { LoyaltyPhoneForm } from './LoyaltyPhoneForm'
import { BillSummary } from './BillSummary'
import { CashHandoverPanel } from './CashHandoverPanel'
import type { usePrepareBill } from '../hooks/usePrepareBill'

export function BillingDetails({
  selected,
  tab,
  prepare,
  cashShiftId,
  cashRegisterId,
  restaurantId,
  onPaid,
}: {
  selected: BillingEntry | undefined
  tab: BillingTab
  prepare: ReturnType<typeof usePrepareBill>
  cashShiftId: string
  cashRegisterId: string
  restaurantId: string
  onPaid: (billId: string) => void
}) {
  const billId = selected?.billId
  const checkoutId = selected?.checkoutId
  const canPrepare =
    tab === 'incoming' && selected?.status === 'Submitted' && !!checkoutId
  const bill = useQuery({
    queryKey: ['cashier', 'bill-details', billId],
    queryFn: ({ signal }) => getCashierBill(billId!, signal),
    enabled: !!billId,
    retry: false,
  })
  const recordedAt = tab === 'paid' ? selected?.paidAt : selected?.submittedAt
  const metadata = selected
    ? [
        ...new Set(selected.tables.map((table) => table.areaName)),
        selected.billCode,
        recordedAt &&
          new Date(recordedAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
      ]
        .filter(Boolean)
        .join(' · ')
    : ''

  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-xl font-bold">
            {selected && selected.tables.some((table) => table.tableCode) && 'Bàn '}
            {selected ? tableName(selected) : 'Hóa đơn'}
          </h2>
          {metadata && (
            <p
              className="mt-1 truncate text-xs text-slate-500"
              title={metadata}
            >
              {metadata}
            </p>
          )}
        </div>
        {selected && (
          <span
            className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${tab === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-current"
            />
            {tab === 'incoming' && selected.billId
              ? 'Chờ thanh toán'
              : (STATUS_NAMES[selected.status] ?? selected.status)}
          </span>
        )}
      </header>
      {!selected ? (
        <p className="p-5 text-sm text-slate-500">
          Chọn thẻ bàn để xem hóa đơn.
        </p>
      ) : !billId ? (
        <div className="space-y-3 p-5">
          <p className="text-sm text-slate-500">Bàn này chưa có hóa đơn.</p>
          {canPrepare && (
            <>
              {prepare.isError &&
                prepare.variables?.checkoutId === checkoutId && (
                  <p role="alert" className="text-sm text-rose-700">
                    {cashShiftError(prepare.error)}
                  </p>
                )}
              <button
                type="button"
                className="btn-primary w-full"
                disabled={prepare.isPending}
                onClick={() => prepare.mutate({ ...selected, checkoutId })}
              >
                {prepare.isPending ? 'Đang tạo hóa đơn…' : 'Tạo hóa đơn'}
              </button>
            </>
          )}
        </div>
      ) : bill.isPending ? (
        <p role="status" className="p-5 text-sm text-slate-500">
          Đang tải hóa đơn…
        </p>
      ) : bill.isError ? (
        <div className="space-y-3 p-5">
          <p role="alert" className="text-sm text-rose-700">
            {cashShiftError(bill.error)}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => void bill.refetch()}
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          {tab === 'incoming' && bill.data.status === 'Unpaid' && (
            <LoyaltyPhoneForm
              key={billId}
              billId={billId}
              customerRef={bill.data.customerRef}
            />
          )}
          <BillSummary bill={bill.data} paid={tab === 'paid'} />
          {tab === 'incoming' && (
            <CashHandoverPanel
              key={billId}
              billId={billId}
              shiftId={cashShiftId}
              registerId={cashRegisterId}
              restaurantId={restaurantId}
              onPaid={onPaid}
            />
          )}
        </>
      )}
    </section>
  )
}
