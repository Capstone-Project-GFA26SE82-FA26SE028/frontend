import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { CustomerMember } from '../types/types'
import { Badge } from '../../../../components/Badge/Badge'

const pointColors: Record<string, string> = {
  BRONZE:
    'bg-[linear-gradient(120deg,#c58c5d_0%,#e7bd94_35%,#fff0da_50%,#dfad7f_65%,#bc8050_100%)] text-[#542a12] ring-1 ring-inset ring-[#a66b3b]/35',
  SILVER:
    'bg-[linear-gradient(120deg,#aeb9c8_0%,#e0e6ee_35%,#ffffff_50%,#d7dfe9_65%,#a8b4c4_100%)] text-slate-800 ring-1 ring-inset ring-slate-400/40',
  GOLD:
    'bg-[linear-gradient(120deg,#d5a526_0%,#f5d77c_35%,#fff7ca_50%,#edc657_65%,#c99a1d_100%)] text-[#583b06] ring-1 ring-inset ring-amber-600/35',
}

export function MemberCard({ member }: { member: CustomerMember }) {
  return (
    <section
      aria-label="Thông tin thành viên"
      className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white p-5 shadow-sm shadow-brand/5 sm:p-6"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mint text-brand"
            >
              <Icon name="users" size={21} />
            </span>
            <div className="min-w-0">
              <h2 className="break-words text-base font-semibold">
                {member.customerName}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {member.normalizedPhone}
              </p>
            </div>
          </div>
          <Badge
            tone={
              member.loyaltyTierCode.trim().toUpperCase() === 'BRONZE'
                ? 'bronze'
                : member.loyaltyTierCode.trim().toUpperCase() === 'SILVER'
                  ? 'silver'
                  : member.loyaltyTierCode.trim().toUpperCase() === 'GOLD'
                    ? 'gold'
                    : 'green'
            }
          >
            {member.loyaltyTierName}
          </Badge>
        </div>
        <div
          className={`relative isolate mt-5 overflow-hidden rounded-2xl px-5 py-7 ${pointColors[member.loyaltyTierCode.trim().toUpperCase()] || 'bg-brand-dark text-white'}`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-10 -z-10 size-44 rounded-full border-[24px] border-current opacity-5"
          />
          <div className="flex items-center gap-2 text-xs opacity-80">
            <Icon name="coin" size={16} />
            <p>Điểm khả dụng</p>
          </div>
          <p className="mt-3 break-words text-5xl font-bold tracking-tight">
            {new Intl.NumberFormat('vi-VN').format(member.availablePoints)}{' '}
            <span className="text-sm font-normal tracking-normal opacity-70">
              điểm
            </span>
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 divide-x divide-stone-100">
        <div className="pr-3">
          <dt className="text-xs text-muted">Ưu đãi theo hạng</dt>
          <dd className="mt-2 text-xl font-semibold text-brand">
            {member.discountPercent}%
          </dd>
        </div>
        <div className="pl-4">
          <dt className="text-xs text-muted">Tổng chi tiêu</dt>
          <dd className="mt-2 break-words text-base font-semibold sm:text-lg">
            {formatCurrency(member.totalSpent)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
