import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { Icon } from '../../../../components/Icon/Icon'
import { RestaurantList } from '../components/RestaurantList'

export function RestaurantsPage() {
  return (
    <div
      lang="vi"
      className="flex min-h-dvh flex-col bg-[#faf9f6] text-[#173e32]"
    >
      <HomeHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-10 sm:px-8 sm:pt-8">
        <section
          className="relative isolate mb-7 flex min-h-52 items-center justify-between gap-6 overflow-hidden rounded-3xl bg-[#164B3B] px-6 py-7 text-white sm:px-9 sm:py-8"
          aria-labelledby="restaurant-banner-title"
        >
          <div className="relative z-10 max-w-lg">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c7df9e]">
              <Icon name="store" size={15} />
              Nhà hàng trên DineLink
            </p>
            <h1
              id="restaurant-banner-title"
              className="text-2xl font-semibold leading-[1.25] tracking-tight sm:text-3xl"
            >
              Chọn nhà hàng.
              <br />
              <span className="text-[#d7e9b7]">Tìm món bạn thích.</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-emerald-50/80">
              Xem thực đơn và đặt món từ nhà hàng bạn chọn.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none relative mr-2 hidden h-40 w-64 shrink-0 lg:block"
          >
            <div className="absolute top-2 left-0 h-32 w-28 -rotate-12 rounded-2xl border border-white/20 bg-white/10 p-3">
              <div className="flex h-16 items-center justify-center rounded-xl bg-[#c7df9e]/20 text-[#d7e9b7]">
                <Icon name="cup" size={28} />
              </div>
              <div className="mt-3 h-1.5 w-14 rounded-full bg-white/30" />
              <div className="mt-2 h-1 w-10 rounded-full bg-white/15" />
            </div>
            <div className="absolute top-2 right-0 h-32 w-28 rotate-12 rounded-2xl border border-white/20 bg-white/10 p-3">
              <div className="flex h-16 items-center justify-center rounded-xl bg-[#c7df9e]/20 text-[#d7e9b7]">
                <Icon name="utensils" size={28} />
              </div>
              <div className="mt-3 h-1.5 w-14 rounded-full bg-white/30" />
              <div className="mt-2 h-1 w-10 rounded-full bg-white/15" />
            </div>
            <div className="absolute top-0 left-1/2 h-36 w-32 -translate-x-1/2 rounded-2xl border border-white/80 bg-[#f6f8ef] p-3 shadow-xl shadow-black/15">
              <div className="flex h-20 items-center justify-center rounded-xl bg-[#dfead2] text-[#226449]">
                <Icon name="store" size={38} />
              </div>
              <div className="mt-3 h-1.5 w-16 rounded-full bg-[#226449]/40" />
              <div className="mt-2 flex items-center gap-1">
                <Icon name="pin" size={10} className="text-[#226449]/50" />
                <div className="h-1 w-12 rounded-full bg-[#226449]/20" />
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -bottom-32 -z-10 size-96 rounded-full bg-white/[0.04]"
          />
        </section>
        <RestaurantList />
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-slate-500 sm:px-8">
        <span>DineLink</span>
        <a
          href="mailto:foodhub@gmail.com"
          className="flex items-center gap-2 hover:text-emerald-800"
        >
          <Icon name="mail" size={14} />
          foodhub@gmail.com
        </a>
      </footer>
    </div>
  )
}
