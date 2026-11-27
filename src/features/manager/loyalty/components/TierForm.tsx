import { useState, type FormEvent } from 'react'
import type { LoyaltyPolicy, LoyaltyTier, TierInput } from '../api/loyaltyApi'

const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })

export function TierForm({ tier, tiers, policy, pending, onSave, onClose }: {
  tier: TierInput & { loyaltyTierId?: string }
  tiers: LoyaltyTier[]
  policy?: LoyaltyPolicy
  pending: boolean
  onSave: (values: TierInput) => void
  onClose: () => void
}) {
  const [unit, setUnit] = useState<'money' | 'points'>('money')
  const [threshold, setThreshold] = useState(String(tier.requiredSpend))
  const [error, setError] = useState('')
  const requiredSpend = unit === 'points' && policy ? Number(threshold) * policy.spendPerPoint : Number(threshold)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const discountPercent = Number(fields.get('discountPercent'))
    if (!threshold.trim() || !Number.isFinite(requiredSpend) || requiredSpend < 0 || !Number.isSafeInteger(Math.round(requiredSpend * 100))) {
      setError('Ngưỡng lên hạng phải là số không âm và nằm trong phạm vi hợp lệ.')
      return
    }
    const order = ['BRONZE', 'SILVER', 'GOLD', 'DIAMOND']
    const index = order.indexOf(tier.loyaltyTierCode.trim().toUpperCase())
    const conflict = tiers.find((other) => {
      if (other.loyaltyTierId === tier.loyaltyTierId) return false
      const otherIndex = order.indexOf(other.loyaltyTierCode.trim().toUpperCase())
      return other.requiredSpend === requiredSpend || (index >= 0 && otherIndex >= 0 &&
        (otherIndex < index ? other.requiredSpend >= requiredSpend : other.requiredSpend <= requiredSpend))
    })
    if (conflict) {
      setError(`Ngưỡng lên hạng cần tăng dần và không trùng ngưỡng của ${conflict.loyaltyTierName} (${number.format(conflict.requiredSpend)} đ).`)
      return
    }
    const loyaltyTierName = String(fields.get('name') || '').trim()
    if (!loyaltyTierName || !Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      setError('Nhập tên hạng và tỷ lệ ưu đãi từ 0% đến 100%.')
      return
    }
    setError('')
    onSave({ loyaltyTierCode: tier.loyaltyTierCode, loyaltyTierName, requiredSpend: Number(requiredSpend.toFixed(2)), discountPercent })
  }
  return (
    <form className="space-y-5 p-6" onSubmit={submit}>
      <fieldset disabled={pending} className="space-y-5">
        <label className="block text-sm font-medium">Tên hạng<input name="name" required maxLength={100} defaultValue={tier.loyaltyTierName} className="field mt-2" /></label>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Mã hạng: <strong className="text-slate-700">{tier.loyaltyTierCode}</strong></div>
        <label className="block text-sm font-medium">Đơn vị nhập ngưỡng<select value={unit} className="field mt-2" onChange={(event) => {
          const next = event.target.value as 'money' | 'points'
          if (policy && threshold.trim() && Number.isFinite(Number(threshold))) {
            setThreshold(String(next === 'points' ? Number(threshold) / policy.spendPerPoint : Number(threshold) * policy.spendPerPoint))
          }
          setUnit(next)
        }}><option value="money">Tổng chi tiêu (đ)</option><option value="points" disabled={!policy}>Điểm quy đổi theo chính sách hiện tại</option></select></label>
        <label className="block text-sm font-medium">{unit === 'points' ? 'Ngưỡng điểm quy đổi' : 'Ngưỡng chi tiêu để đạt hạng (đ)'}<input type="number" min="0" step="any" required value={threshold} onChange={(event) => setThreshold(event.target.value)} className="field mt-2" /></label>
        {Number.isFinite(requiredSpend) && requiredSpend >= 0 && <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">Ngưỡng lưu vào hệ thống: <strong>{number.format(requiredSpend)} đ</strong>{policy && <> · tương đương {number.format(requiredSpend / policy.spendPerPoint)} điểm theo chính sách hiện tại.</>}</p>}
        <label className="block text-sm font-medium">Ưu đãi của hạng (%)<input name="discountPercent" type="number" min="0" max="100" step="0.01" required defaultValue={tier.discountPercent} className="field mt-2" /></label>
      </fieldset>
      <p className="text-xs leading-5 text-slate-500">Hệ thống xét hạng theo tổng chi tiêu hợp lệ. Điểm quy đổi chỉ hỗ trợ nhập ngưỡng, không phải số dư điểm của khách. Đổi chính sách tích điểm không tự thay đổi ngưỡng chi tiêu đã lưu.</p>
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="btn-secondary" disabled={pending} onClick={onClose}>Hủy</button><button type="submit" className="btn-primary" disabled={pending}>{pending ? 'Đang lưu…' : tier.loyaltyTierId ? 'Lưu cấu hình hạng' : 'Tạo hạng'}</button></div>
    </form>
  )
}

export type TierDraft = TierInput & Partial<Pick<LoyaltyTier, 'loyaltyTierId'>>
