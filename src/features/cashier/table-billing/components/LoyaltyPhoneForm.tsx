import { useId, useState } from 'react'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { useSaveLoyaltyPhone } from '../hooks/useSaveLoyaltyPhone'
import { loyaltyPhoneSchema } from '../schemas/loyaltyPhoneSchema'

export function LoyaltyPhoneForm({
  billId,
  customerRef,
}: {
  billId: string
  customerRef: string | null
}) {
  const id = useId()
  const [phone, setPhone] = useState('')
  const [validation, setValidation] = useState('')
  const assign = useSaveLoyaltyPhone(billId)

  return (
    <form
      className="space-y-2 border-b border-slate-100 px-5 py-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (assign.isPending) return
        const result = loyaltyPhoneSchema.safeParse(phone)
        if (!result.success) {
          setValidation(result.error.issues[0].message)
          return
        }
        setValidation('')
        assign.mutate(result.data)
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          Số điện thoại tích điểm
        </label>
        {customerRef && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            Đã lưu số
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="tel"
          autoComplete="off"
          maxLength={24}
          value={phone}
          disabled={assign.isPending}
          aria-invalid={!!validation}
          aria-describedby={validation ? `${id}-error` : undefined}
          onChange={(event) => {
            setPhone(event.target.value)
            setValidation('')
            if (assign.isError) assign.reset()
          }}
          placeholder="Nhập số điện thoại"
          className="min-h-11 min-w-0 flex-1 basis-36 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
        <button type="submit" className="btn-secondary min-h-11" disabled={!phone.trim() || assign.isPending}>
          {assign.isPending ? 'Đang lưu…' : customerRef ? 'Cập nhật số' : 'Lưu'}
        </button>
      </div>
      {(validation || assign.isError) && (
        <p id={`${id}-error`} role="alert" className="text-sm text-rose-700">
          {validation || cashShiftError(assign.error)}
        </p>
      )}
      {assign.isSuccess && (
        <p role="status" className="text-xs text-emerald-800">
          Điểm sẽ được cộng sau khi thanh toán.
        </p>
      )}
    </form>
  )
}
