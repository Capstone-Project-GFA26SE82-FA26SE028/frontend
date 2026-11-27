import { useState, type FormEvent } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { LoyaltyPolicy, PolicyInput } from '../api/loyaltyApi'

export function PolicyForm({ policy, pending, onSave }: {
  policy: LoyaltyPolicy
  pending: boolean
  onSave: (values: PolicyInput) => void
}) {
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const spendPerPoint = Number(fields.get('spendPerPoint'))
    const moneyPerRedeemedPoint = Number(fields.get('moneyPerRedeemedPoint'))
    if (![spendPerPoint, moneyPerRedeemedPoint].every((value) => Number.isFinite(value) && value > 0)) {
      setError('Giá trị tích điểm và đổi điểm phải lớn hơn 0.')
      return
    }
    setError('')
    onSave({ spendPerPoint, moneyPerRedeemedPoint })
  }
  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" onSubmit={submit}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="flex items-center gap-2 font-bold text-slate-800"><Icon name="coin" size={20} />Chính sách tích và đổi điểm</h2><p className="mt-2 text-sm text-slate-500">Thiết lập giá trị tích lũy và giá trị sử dụng của một điểm.</p></div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{policy.policyId === '00000000-0000-0000-0000-000000000000' ? 'Chưa lưu chính sách' : `Phiên bản ${policy.version}`}</span>
      </div>
      <fieldset disabled={pending} className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Chi tiêu để tích 1 điểm (đ)<input name="spendPerPoint" type="number" min="0.01" step="0.01" required defaultValue={policy.spendPerPoint} className="field mt-2" /><span className="mt-2 block text-xs font-normal leading-5 text-slate-500">Số tiền chi tiêu hợp lệ tương ứng với 1 điểm tích lũy.</span></label>
        <label className="text-sm font-medium text-slate-700">Giá trị của 1 điểm khi sử dụng (đ)<input name="moneyPerRedeemedPoint" type="number" min="0.01" step="0.01" required defaultValue={policy.moneyPerRedeemedPoint} className="field mt-2" /><span className="mt-2 block text-xs font-normal leading-5 text-slate-500">Số tiền được giảm khi khách sử dụng 1 điểm.</span></label>
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <p className="max-w-xl text-xs leading-5 text-slate-500">Lưu sẽ tạo phiên bản chính sách mới. Lịch sử điểm đã ghi nhận được giữ nguyên.</p>
        <button type="submit" disabled={pending} className="btn-primary"><Icon name="check" size={17} />{pending ? 'Đang lưu…' : 'Lưu chính sách điểm'}</button>
      </div>
    </form>
  )
}
