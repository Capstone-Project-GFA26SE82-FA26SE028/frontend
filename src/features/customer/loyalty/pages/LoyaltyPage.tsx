import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import { loyaltyError } from '../api/loyaltyApi'
import { MemberCard } from '../components/MemberCard'
import { useLoyalty } from '../hooks/useLoyalty'
import { Badge } from '../../../../components/Badge/Badge'

export function LoyaltyPage() {
  const m = useLoyalty()
  return (
    <div className="mx-auto max-w-4xl space-y-5 pt-2 pb-8 sm:pt-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Điểm tích lũy</h1>
        <p className="mt-2 text-sm text-muted">
          Tra cứu bằng số điện thoại đã đăng ký.
        </p>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void m.lookup()
        }}
        className="rounded-2xl border border-stone-200/70 bg-white p-4 sm:p-5"
      >
        <label htmlFor="member-phone" className="text-sm font-medium">
          Số điện thoại
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="member-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            value={m.phone}
            onChange={(event) => m.changePhone(event.target.value)}
            placeholder="Nhập số điện thoại"
            aria-invalid={!!m.error}
            aria-describedby={m.error ? 'member-error' : undefined}
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
          <button
            type="submit"
            disabled={m.pending}
            aria-label={m.pending ? 'Đang tra cứu' : 'Tra cứu điểm'}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Icon
              name={m.pending ? 'refresh' : 'search'}
              size={17}
              className={m.pending ? 'animate-spin' : ''}
            />
            <span>Tra cứu</span>
          </button>
        </div>
        {m.pending && (
          <p role="status" className="mt-3 text-xs text-muted">
            Đang tải điểm thành viên…
          </p>
        )}
        {m.error && (
          <p
            id="member-error"
            role="alert"
            className="mt-3 text-sm text-rose-700"
          >
            {m.error}
          </p>
        )}
      </form>
      {m.member && (
        <div className="grid items-start gap-5 md:grid-cols-2">
          <MemberCard member={m.member} />
          <section
            aria-label="Các hạng thành viên"
            className="rounded-3xl border border-stone-200/70 bg-white p-5 sm:p-6"
          >
            <h2 className="flex items-center gap-2 font-semibold">
              <Icon name="crown" size={18} className="text-brand" />
              Hạng thành viên
            </h2>
            {m.tiers.isPending ? (
              <p role="status" className="mt-4 text-sm text-muted">
                Đang tải các hạng…
              </p>
            ) : m.tiers.isError ? (
              <div className="mt-4 text-sm">
                <p role="alert" className="text-muted">
                  {loyaltyError(m.tiers.error)}
                </p>
                <button
                  type="button"
                  onClick={() => void m.tiers.refetch()}
                  className="mt-2 min-h-10 font-medium text-brand"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {[...(m.tiers.data || [])]
                  .sort((a, b) => a.requiredSpend - b.requiredSpend)
                  .map((tier) => (
                    <li
                      key={tier.loyaltyTierId}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 ${tier.loyaltyTierId === m.member?.loyaltyTierId ? 'border-emerald-200 bg-mint/50' : 'border-stone-100 bg-stone-50/60'}`}
                    >
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          <Badge
                            tone={
                              tier.loyaltyTierCode.trim().toUpperCase() ===
                              'BRONZE'
                                ? 'bronze'
                                : tier.loyaltyTierCode.trim().toUpperCase() ===
                                    'SILVER'
                                  ? 'silver'
                                  : tier.loyaltyTierCode
                                        .trim()
                                        .toUpperCase() === 'GOLD'
                                    ? 'gold'
                                    : 'green'
                            }
                          >
                            {tier.loyaltyTierName}
                          </Badge>
                          {tier.loyaltyTierId === m.member?.loyaltyTierId && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand">
                              <Icon name="check" size={12} />
                              Hiện tại
                            </span>
                          )}
                        </p>
                        <p className="mt-2 text-xs text-muted">
                          Chi tiêu từ {formatCurrency(tier.requiredSpend)}
                        </p>
                      </div>
                      <span className="shrink-0 text-right">
                        <span className="block text-xl font-semibold text-brand">
                          {tier.discountPercent}%
                        </span>
                        <span className="mt-1 block text-[10px] text-muted">
                          Ưu đãi
                        </span>
                      </span>
                    </li>
                  ))}
                {m.tiers.data?.length === 0 && (
                  <li className="py-3 text-sm text-muted">
                    Chưa có hạng thành viên.
                  </li>
                )}
              </ul>
            )}
          </section>
        </div>
      )}
      {!m.member && !m.pending && !m.error && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-mint/50 px-4 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
            <Icon name="crown" size={19} />
          </span>
          <div>
            <p className="text-sm text-muted">Tra cứu điểm và ưu đãi của bạn.</p>
          </div>
        </div>
      )}
    </div>
  )
}
