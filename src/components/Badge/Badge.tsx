import type { ReactNode } from 'react'

const badgeColors = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-sky-50 text-sky-700',
  purple: 'bg-purple-50 text-purple-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  orange: 'bg-orange-50 text-orange-700',
  bronze:
    'bg-[linear-gradient(120deg,#c58c5d_0%,#e7bd94_35%,#fff0da_50%,#dfad7f_65%,#bc8050_100%)] text-[#542a12] ring-1 ring-inset ring-[#a66b3b]/35 shadow-[inset_0_1px_0_#fff7ed,0_1px_3px_#92400e20]',
  silver:
    'bg-[linear-gradient(120deg,#aeb9c8_0%,#e0e6ee_35%,#ffffff_50%,#d7dfe9_65%,#a8b4c4_100%)] text-slate-800 ring-1 ring-inset ring-slate-400/40 shadow-[inset_0_1px_0_#ffffff,0_1px_3px_#47556920]',
  gold:
    'bg-[linear-gradient(120deg,#d5a526_0%,#f5d77c_35%,#fff7ca_50%,#edc657_65%,#c99a1d_100%)] text-[#583b06] ring-1 ring-inset ring-amber-600/35 shadow-[inset_0_1px_0_#fff9db,0_1px_3px_#a1620725]',
}

// Nhãn dùng chung cho trạng thái, vai trò; nội dung và màu do từng chức năng truyền vào.
export function Badge({
  children,
  tone = 'green',
}: {
  children: ReactNode
  tone?:
    | 'green'
    | 'amber'
    | 'red'
    | 'slate'
    | 'blue'
    | 'purple'
    | 'cyan'
    | 'orange'
    | 'bronze'
    | 'silver'
    | 'gold'
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${badgeColors[tone]}`}
    >
      {children}
    </span>
  )
}
