import { useState } from 'react'
import { formatCurrency } from '../../../../utils/currency'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { BillVoucherPicker } from './BillVoucherPicker'
import { useBillVoucher } from '../hooks/useBillVoucher'
import type { BillVoucherAdjustment } from '../types/types'

export function BillVoucherForm({ billId, restaurantId, shiftId, adjustments }: {
  billId: string
  restaurantId: string
  shiftId: string
  adjustments?: BillVoucherAdjustment[]
}) {
  const [code, setCode] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const voucher = useBillVoucher(billId, restaurantId, shiftId)
  const applied = adjustments?.filter((item) => item.type === 'Voucher' && item.voucherId) ?? []

  return (
    <section className="space-y-3 border-b border-slate-100 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Ưu đãi</h3>
        <button type="button" className="text-sm font-semibold text-emerald-800 hover:underline disabled:opacity-50"
          disabled={voucher.isPending} onClick={() => setShowPicker(true)}>
          Xem mã ưu đãi
        </button>
      </div>
      <form className="flex items-center gap-2" onSubmit={(event) => {
        event.preventDefault()
        if (!code.trim() || voucher.isPending) return
        voucher.mutate({ code: code.trim() }, { onSuccess: () => setCode('') })
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
        <button type="submit" className="btn-secondary shrink-0" disabled={!code.trim() || voucher.isPending}>Áp dụng</button>
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
          >Gỡ mã</button>
        </div>
      ))}
      {voucher.isPending && <p role="status" className="text-xs text-slate-500">Đang cập nhật ưu đãi…</p>}
      {voucher.isError && <p role="alert" className="text-sm text-rose-700">{cashShiftError(voucher.error)}</p>}
      {showPicker && (
        <BillVoucherPicker
          restaurantId={restaurantId}
          appliedIds={applied.map((item) => item.voucherId)}
          onClose={() => setShowPicker(false)}
          onSelect={(selected) => {
            setCode(selected)
            voucher.reset()
            setShowPicker(false)
          }}
        />
      )}
    </section>
  )
}