import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon/Icon'
import { HomeHeader } from '../components/HomeHeader/HomeHeader'

export function HomePage() {
  return (
    <div
      lang="vi"
      className="flex min-h-dvh flex-col bg-[#faf9f6] text-[#173e32]"
    >
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
        <section className="grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-[#123d30] shadow-[0_20px_60px_-25px_rgba(18,61,48,0.4)] sm:max-w-[220px] lg:order-2 lg:max-w-[260px]">
            <img
              src="/images/login-dining.svg"
              alt="Đĩa salad xanh cùng dao và nĩa"
              width={480}
              height={440}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="mx-auto w-full max-w-sm text-center lg:order-1 lg:mx-0 lg:max-w-none lg:text-left">
            <h1 className="text-4xl font-semibold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl">
              Bữa ngon
              <br />
              <span className="text-emerald-700">bắt đầu từ đây.</span>
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/restaurants"
                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-[#226449] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-[#184c37] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
              >
                Xem nhà hàng
                <Icon name="arrow" size={18} />
              </Link>
              <Link
                to="/reservation"
                className="inline-flex min-h-13 items-center justify-center rounded-2xl border border-emerald-800/20 bg-white px-6 py-4 text-sm font-bold text-[#226449] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
              >
                Đặt bàn
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-slate-500 sm:px-8">
        <span>DineLink</span>
        <a
          href="mailto:foodhub@gmail.com"
          className="flex items-center gap-2 underline-offset-4 hover:text-emerald-800 hover:underline"
        >
          <Icon name="mail" size={14} />
          dinelink@gmail.com
        </a>
      </footer>
    </div>
  )
}
