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
          className="relative isolate mb-8 flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-[#123d30] px-6 py-8 text-white sm:px-10 sm:py-9"
          aria-labelledby="restaurant-banner-title"
        >
          <div className="relative z-10 max-w-xl">
            <h1
              id="restaurant-banner-title"
              className="text-3xl font-semibold leading-[1.2] tracking-tight sm:text-4xl"
            >
              Chọn nhà hàng,
              <br />
              <span className="text-[#d7e9b7]">xem món ngon.</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/80">
              Xem thực đơn nhà hàng bạn thích, chọn món cho bữa ăn sắp tới.
            </p>
          </div>
          <img
            src="/images/login-dining.svg"
            alt=""
            aria-hidden="true"
            width={280}
            height={260}
            className="pointer-events-none hidden w-52 shrink-0 object-contain sm:block lg:w-64"
          />
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
