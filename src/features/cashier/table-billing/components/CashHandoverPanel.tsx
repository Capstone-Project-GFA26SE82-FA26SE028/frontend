import { formatCurrencyInput } from '../../../../utils/currency'
import { useState } from 'react'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { useCashHandover } from '../hooks/useCashHandover'
import { cashHandoverSchema } from '../schemas/cashHandoverSchema'
import { money } from '../utils/billingDisplay'

export function CashHandoverPanel({
  restaurantId,
  registerId,
  shiftId,
  billId,
  onPaid,
}: {
  restaurantId: string
  registerId: string
  shiftId: string
  billId: string
  onPaid: (billId: string) => void
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

  return (
    <section className="space-y-3 border-t border-slate-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Xác nhận đã nhận tiền mặt</h3>
        <button
          type="button"
          className="text-sm font-medium text-emerald-800 underline-offset-4 hover:underline disabled:opacity-50"
          disabled={handover.isFetching || confirm.isPending}
          onClick={() => void handover.refetch()}
        >
          Làm mới
        </button>
      </div>
      {confirm.isError && (
        <p role="alert" className="text-sm text-rose-700">
          {cashShiftError(confirm.error)}
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
        <p className="text-sm text-slate-500">
          Chưa có khoản tiền mặt chờ bàn giao.
        </p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (amount.success && matches && !confirm.isPending && !handover.isFetching)
              confirm.mutate({ paymentId: pending.paymentId, amount: amount.data })
          }}
        >
          <dl className="space-y-1 rounded-xl bg-slate-50 p-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt>Tiền phục vụ ghi nhận</dt>
              <dd>{money.format(pending.cashReceived)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Tiền thừa</dt>
              <dd>{money.format(pending.changeAmount)}</dd>
            </div>
            <div className="flex justify-between gap-2 font-medium">
              <dt>Tiền hóa đơn</dt>
              <dd>{money.format(pending.amount)}</dd>
            </div>
          </dl>
          <label className="block text-sm font-medium">
              Số tiền nhận từ phục vụ
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
              className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3"
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
            className="btn-primary w-full"
            disabled={!matches || confirm.isPending || handover.isFetching}
          >
            {confirm.isPending ? 'Đang xác nhận…' : 'Xác nhận nhận tiền'}
          </button>
        </form>
      )}
    </section>
  )
}
