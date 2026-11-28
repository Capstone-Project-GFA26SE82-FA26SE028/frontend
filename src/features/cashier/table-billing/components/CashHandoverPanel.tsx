import { formatCurrencyInput } from '../../../../utils/currency'
import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { useCashHandover } from '../hooks/useCashHandover'
import { cashHandoverSchema } from '../schemas/cashHandoverSchema'
import { money } from '../utils/billingDisplay'
import { getCashHandoverError } from '../api/cashHandoverApi'

export function CashHandoverPanel({
  restaurantId,
  registerId,
  shiftId,
  billId,
  onPaid,
  paid = false,
}: {
  restaurantId: string
  registerId: string
  shiftId: string
  billId: string
  onPaid: (billId: string) => void
  paid?: boolean
}) {
  const [input, setInput] = useState('')
  const { handover, confirm } = useCashHandover(
    restaurantId,
    registerId,
    shiftId,
    billId,
    onPaid,
  )
  const pending = handover.isSuccess ? handover.data : null
  const amount = cashHandoverSchema.safeParse(input)
  const matches = amount.success && amount.data === pending?.cashReceived
  const result = getCashHandoverError(confirm.error)
  const cashReturnRequired = pending?.status === 'ReturnRequired' || result?.status === 'CashReturnRequired'
  const waitingForPayOs = result?.status === 'PendingReconciliation'
  if (cashReturnRequired) {
    const returnAmount = pending?.status === 'ReturnRequired' ? pending.cashReceived : result?.amount
    return (
      <div role="alert" className="m-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Cần trả lại tiền mặt</p>
        <p>Khách đã thanh toán qua PayOS. Trả lại {returnAmount == null ? 'toàn bộ tiền mặt' : money.format(returnAmount)} đã nhận.</p>
      </div>
    )
  }
  if (paid) return null

  return (
    <section className="space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Tiền phục vụ bàn giao</h3>
        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          disabled={handover.isFetching || confirm.isPending}
          onClick={() => void handover.refetch()}
        >
          <Icon name="refresh" size={15} />
          {handover.isFetching ? 'Đang tải…' : 'Làm mới'}
        </button>
      </div>
      {confirm.isError && (
        <p role="alert" className={waitingForPayOs ? 'rounded-xl bg-amber-50 p-3 text-sm text-amber-900' : 'text-sm text-rose-700'}>
          {waitingForPayOs ? 'Chờ đối soát PayOS. Chưa ghi nhận tiền mặt.' : cashShiftError(confirm.error)}
        </p>
      )}
      {handover.isPending ? (
        <p role="status" className="text-sm text-slate-500">
          Đang kiểm tra bàn giao…
        </p>
      ) : handover.isError ? (
        <p role="alert" className="text-sm text-rose-700">
          {cashShiftError(handover.error)}
        </p>
      ) : !pending ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-4 text-sm text-slate-600">
          <Icon name="clock" size={18} />
          Chưa có khoản tiền mặt chờ bàn giao.
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (amount.success && matches && !confirm.isPending && !handover.isFetching)
              confirm.mutate({ paymentId: pending.paymentId, amount: amount.data })
          }}
        >
          <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm tabular-nums">
            <div className="flex items-center justify-between gap-2 py-2.5">
              <dt className="text-slate-600">Tiền phục vụ ghi nhận</dt>
              <dd className="font-semibold text-slate-900">{money.format(pending.cashReceived)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 py-2.5">
              <dt className="text-slate-600">Tiền thừa trả khách</dt>
              <dd className="font-semibold text-emerald-800">{money.format(pending.changeAmount)}</dd>
            </div>
          </dl>
          <label className="block text-sm font-medium text-slate-800">
            Số tiền thực nhận
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={formatCurrencyInput(input)}
              onChange={(event) => {
                const digits = event.target.value.replace(/\./g, '')
                if (/^\d*$/.test(digits)) setInput(digits)
              }}
              placeholder="Nhập số tiền (đ)"
              aria-invalid={!!input && !matches}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold tabular-nums placeholder:font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          {input && !matches && (
            <p className="text-sm text-rose-700">
              {amount.success
                ? 'Số tiền phải khớp với tiền phục vụ ghi nhận.'
                : amount.error.issues[0]?.message}
            </p>
          )}
          <button
            type="submit"
            className="btn-primary w-full gap-2"
            disabled={!matches || confirm.isPending || handover.isFetching}
          >
            <Icon name="check" size={17} />
            {confirm.isPending ? 'Đang xác nhận…' : waitingForPayOs ? 'Kiểm tra lại đối soát' : 'Xác nhận đã nhận tiền'}
          </button>
        </form>
      )}
    </section>
  )
}
