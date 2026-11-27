import { useState, type ReactNode } from 'react'
import { formatCurrency } from '../../../../utils/currency'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { BillVoucherPicker } from './BillVoucherPicker'
import { useBillVoucher } from '../hooks/useBillVoucher'
import type { BillVoucherAdjustment } from '../types/types'

export function BillVoucherForm({ billId, restaurantId, shiftId, adjustments, actions }: {
  billId: string
  restaurantId: string
  shiftId: string
  adjustments?: BillVoucherAdjustment[]
  actions: ReactNode
}) {
  const [code, setCode] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const voucher = useBillVoucher(billId, restaurantId, shiftId)
  const applied = adjustments?.filter((item) => item.type === 'Voucher' && item.voucherId) ?? []
  const appliedDiscount = applied.reduce((total, item) => total + item.amount, 0)
  const appliedLabel = applied.length === 1
    ? applied[0].reason || 'Đã áp dụng ưu đãi'
    : `${applied.length} ưu đãi đã áp dụng`

  return (
    <section className="space-y-3 border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-2">
        <button type="button" className="flex h-9 min-w-0 flex-1 items-center rounded-lg border border-slate-200 px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          disabled={voucher.isPending} onClick={() => setShowPicker(true)}>
          {applied.length ? (
            <span className="flex w-full min-w-0 items-center justify-between gap-2">
              <span className="truncate" title={appliedLabel}>{appliedLabel}</span>
              <span className="shrink-0">−{formatCurrency(appliedDiscount)}</span>
            </span>
          ) : 'Áp dụng ưu đãi'}
        </button>
        {actions}
      </div>
      {!showPicker && voucher.isPending && <p role="status" className="text-xs text-slate-500">Đang cập nhật ưu đãi…</p>}
      {!showPicker && voucher.isError && <p role="alert" className="text-sm text-rose-700">{cashShiftError(voucher.error)}</p>}
      {showPicker && (
        <BillVoucherPicker
          restaurantId={restaurantId}
          appliedIds={applied.map((item) => item.voucherId)}
          onClose={() => {
            if (voucher.isPending) return
            setShowPicker(false)
            voucher.reset()
          }}
          onSelect={(selected) => {
            if (voucher.isPending) return
            setCode(selected)
            voucher.reset()
          }}
        >
          <form className="flex items-center gap-2" onSubmit={(event) => {
            event.preventDefault()
            const enteredCode = code.trim()
            if (!enteredCode || voucher.isPending) return
            voucher.mutate({ code: enteredCode }, {
              onSuccess: () => {
                setCode('')
                setShowPicker(false)
              },
            })
          }}>
            <input
              aria-label="Mã ưu đãi"
              className="field min-w-0 flex-1"
              placeholder="Nhập mã ưu đãi"
              value={code}
              disabled={voucher.isPending}
              onChange={(event) => {
                setCode(event.target.value)
                voucher.reset()
              }}
            />
            <button type="submit" className="btn-primary shrink-0" disabled={!code.trim() || voucher.isPending}>
              Áp dụng
            </button>
          </form>
          {applied.map((item) => (
            <div key={item.billAdjustmentId} className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm">
              <span className="min-w-0 break-words text-emerald-800">
                {item.reason || 'Đã áp dụng ưu đãi'} · −{formatCurrency(item.amount)}
              </span>
              <button
                type="button"
                className="shrink-0 font-semibold text-rose-700 disabled:opacity-50"
                disabled={voucher.isPending}
                onClick={() => { if (item.voucherId) voucher.mutate({ voucherId: item.voucherId }) }}
              >
                Gỡ mã
              </button>
            </div>
          ))}
          {voucher.isPending && <p role="status" className="text-xs text-slate-500">Đang cập nhật ưu đãi…</p>}
          {voucher.isError && <p role="alert" className="text-sm text-rose-700">{cashShiftError(voucher.error)}</p>}
        </BillVoucherPicker>
      )}
    </section>
  )
}
