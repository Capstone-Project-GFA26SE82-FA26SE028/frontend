import { Icon } from '../Icon/Icon'

export function BrandBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,#32785a_0%,transparent_48%),radial-gradient(ellipse_at_90%_85%,#42684b_0%,transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.05]" />
      <div className="absolute -top-40 -right-40 size-[480px] rounded-full border border-white/[0.08] sm:size-[640px]" />
      <div className="absolute -top-20 -right-20 size-[320px] rounded-full border border-white/[0.06] sm:size-[480px]" />
      <div className="absolute -bottom-52 -left-44 size-[560px] rounded-full border-[60px] border-[#c7df9e]/[0.04]" />
      <div className="absolute top-[28%] left-[9%] hidden size-20 -rotate-12 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-[#d7e9b7]/40 lg:flex">
        <Icon name="store" size={32} />
      </div>
      <div className="absolute right-[10%] bottom-[25%] hidden size-20 rotate-12 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-[#d7e9b7]/40 lg:flex">
        <Icon name="bag" size={32} />
      </div>
    </div>
  )
}
