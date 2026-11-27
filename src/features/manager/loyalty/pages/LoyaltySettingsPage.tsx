import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Icon } from '../../../../components/Icon/Icon'
import { Badge } from '../../../../components/Badge/Badge'
import { Modal } from '../../../../components/Modal/Modal'
import { getPolicy, getTiers, loyaltyError, savePolicy, saveTier, type PolicyInput, type TierInput } from '../api/loyaltyApi'
import { TierForm, type TierDraft } from '../components/TierForm'
import { PolicyForm } from '../components/PolicyForm'

const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })
const standardTiers = [
  { code: 'BRONZE', name: 'Thành viên Đồng' },
  { code: 'SILVER', name: 'Thành viên Bạc' },
  { code: 'GOLD', name: 'Thành viên Vàng' },
]
const tone = (code: string) => ({ BRONZE: 'bronze', SILVER: 'silver', GOLD: 'gold' } as const)[code.toUpperCase() as 'BRONZE' | 'SILVER' | 'GOLD'] || 'green'

export function LoyaltySettingsPage() {
  const user = useAppSelector((state) => state.auth.session?.user)
  const scope = `${user?.userId}:${user?.restaurantId}`
  return <LoyaltySettings key={scope} scope={scope} restaurantId={user?.restaurantId || ''} />
}

function LoyaltySettings({ scope, restaurantId }: { scope: string; restaurantId: string }) {
  const client = useQueryClient()
  const key = ['manager-loyalty', scope]
  const [editing, setEditing] = useState<TierDraft | null>(null)
  const tiers = useQuery({ queryKey: [...key, 'tiers'], enabled: !!restaurantId, queryFn: ({ signal }) => getTiers(restaurantId, signal) })
  const policy = useQuery({ queryKey: [...key, 'policy'], enabled: !!restaurantId, queryFn: ({ signal }) => getPolicy(restaurantId, signal) })
  const tierMutation = useMutation({
    mutationFn: ({ values, id }: { values: TierInput; id?: string }) => saveTier(restaurantId, values, id),
    onSuccess: async () => {
      await Promise.all([client.invalidateQueries({ queryKey: [...key, 'tiers'] }), client.invalidateQueries({ queryKey: ['customer-loyalty-tiers'] })])
      setEditing(null)
      toast.success('Đã lưu cấu hình hạng thành viên.')
    },
  })
  const policyMutation = useMutation({
    mutationFn: (values: PolicyInput) => savePolicy(restaurantId, values),
    onSuccess: (saved) => {
      client.setQueryData([...key, 'policy'], saved)
      toast.success('Đã lưu chính sách điểm.')
    },
  })
  const sorted = [...(tiers.data || [])].sort((a, b) => a.requiredSpend - b.requiredSpend)
  const savedPolicy = policy.data?.policyId !== '00000000-0000-0000-0000-000000000000' ? policy.data : undefined
  const missing = standardTiers.filter((entry) => !sorted.some((tier) => tier.loyaltyTierCode.trim().toUpperCase() === entry.code))
  function edit(tier: TierDraft) {
    tierMutation.reset()
    setEditing(tier)
  }
  return (
    <>
      <PageHeading eyebrow="Khách hàng thân thiết" title="Hạng thành viên" description="Cấu hình ngưỡng lên hạng Đồng, Bạc, Vàng và chính sách tích điểm của nhà hàng."
        action={restaurantId && <button type="button" className="btn-secondary" disabled={tiers.isFetching || policy.isFetching || tierMutation.isPending || policyMutation.isPending} onClick={() => { void tiers.refetch(); void policy.refetch() }}><Icon name="refresh" size={17} />Làm mới</button>} />
      {!restaurantId ? <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Tài khoản chưa được gán nhà hàng. Vui lòng kiểm tra phân công.</p> : (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><Icon name="shield" size={20} /><p><strong>Quy tắc xét hạng hiện tại:</strong> dựa trên tổng chi tiêu hợp lệ. Điểm quy đổi bên dưới được tính theo chính sách tích điểm đang áp dụng, khác với số dư điểm có thể dùng đổi thưởng.</p></div>
          <section aria-label="Cấu hình hạng thành viên">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-slate-800">Các hạng thành viên</h2><span className="text-xs text-slate-500">Sắp xếp theo ngưỡng chi tiêu tăng dần</span></div>
            {tiers.isPending ? <p role="status" className="rounded-2xl bg-white p-6 text-sm text-slate-500">Đang tải hạng thành viên…</p> : tiers.isError ? <ErrorBox message={loyaltyError(tiers.error)} retry={() => void tiers.refetch()} /> : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((tier) => (
                  <article key={tier.loyaltyTierId} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3"><Badge tone={tone(tier.loyaltyTierCode)}><Icon name="crown" size={14} />{tier.loyaltyTierName}</Badge><span className="text-xs text-slate-400">{tier.loyaltyTierCode}</span></div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Chi tiêu để đạt hạng</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">{number.format(tier.requiredSpend)} <span className="text-lg font-medium text-slate-400">đ</span></p>
                    <p className="mt-2 text-sm text-slate-500">{savedPolicy ? `≈ ${number.format(tier.requiredSpend / savedPolicy.spendPerPoint)} điểm quy đổi` : 'Cần chính sách điểm đã lưu để quy đổi'}</p>
                    <div className="my-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-sm text-slate-600">Ưu đãi của hạng</span><strong className="text-lg text-emerald-700">{number.format(tier.discountPercent)}%</strong></div>
                    <button type="button" className="btn-secondary mt-auto w-full" disabled={policyMutation.isPending} onClick={() => edit(tier)}><Icon name="edit" size={17} />Chỉnh sửa hạng</button>
                  </article>
                ))}
                {missing.map((entry) => (
                  <article key={entry.code} className="flex flex-col items-start rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6"><Badge tone={tone(entry.code)}>{entry.name}</Badge><h3 className="mt-6 font-semibold text-slate-700">Chưa thiết lập hạng</h3><p className="mb-6 mt-2 text-sm leading-6 text-slate-500">Tạo ngưỡng lên hạng và ưu đãi cho thành viên.</p><button type="button" className="btn-secondary mt-auto w-full" disabled={policyMutation.isPending} onClick={() => edit({ loyaltyTierCode: entry.code, loyaltyTierName: entry.name, requiredSpend: 0, discountPercent: 0 })}><Icon name="plus" size={17} />Thiết lập hạng</button></article>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-slate-500">Điểm quy đổi chỉ để tham khảo. Điểm thực nhận còn phụ thuộc làm tròn từng hóa đơn và chính sách tại thời điểm tích điểm. Hạng khách hàng được xét lại khi có giao dịch tích điểm tiếp theo.</p>
          </section>
          {policy.isPending ? <p role="status" className="rounded-2xl bg-white p-6 text-sm text-slate-500">Đang tải chính sách điểm…</p> : policy.isError ? <ErrorBox message={loyaltyError(policy.error)} retry={() => void policy.refetch()} /> : policy.data && (
            <div>
              {policyMutation.isError && <div className="mb-4"><ErrorBox message={loyaltyError(policyMutation.error)} /></div>}
              <PolicyForm key={policy.data.policyId + ':' + policy.data.version} policy={policy.data} pending={policyMutation.isPending} onSave={(values) => policyMutation.mutate(values)} />
            </div>
          )}
        </div>
      )}
      {editing && <Modal title={editing.loyaltyTierId ? 'Chỉnh sửa hạng thành viên' : 'Thiết lập hạng thành viên'} subtitle={editing.loyaltyTierName} onClose={() => { if (!tierMutation.isPending) setEditing(null) }}>
        {tierMutation.isError && <div className="px-6 pt-5"><ErrorBox message={loyaltyError(tierMutation.error)} /></div>}
        <TierForm tier={editing} tiers={sorted} policy={savedPolicy} pending={tierMutation.isPending} onClose={() => setEditing(null)} onSave={(values) => tierMutation.mutate({ values, id: editing.loyaltyTierId })} />
      </Modal>}
    </>
  )
}

function ErrorBox({ message, retry }: { message: string; retry?: () => void }) {
  return <div role="alert" className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-800">{message}{retry && <button type="button" className="ml-3 font-semibold underline" onClick={retry}>Thử lại</button>}</div>
}
