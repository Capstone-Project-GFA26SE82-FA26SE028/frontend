import { Link } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'

export function LoginBrandPanel() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-[#123d30] p-6 text-white sm:p-8 md:min-h-[580px] md:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 -z-10 size-96 rounded-full bg-emerald-300/10 blur-3xl"
      />
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          aria-label="FoodHub - Trang chủ"
          className="w-fit text-2xl font-bold tracking-tight"
        >
          FoodHub<span className="text-[#b8df8d]">.</span>
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Icon name="arrow" size={15} className="rotate-180" />
          Về trang chủ
        </Link>
      </div>

      <div className="hidden flex-1 flex-col items-center justify-center md:flex">
        <img
          src="/images/login-dining.svg"
          alt="Minh họa đĩa salad cùng dao và nĩa"
          width={400}
          height={380}
          className="w-full max-w-[380px]"
        />
        <div
          aria-hidden="true"
          className="mt-6 h-1 w-10 rounded-full bg-[#b8df8d]/70"
        />
      </div>
    </section>
  )
}
