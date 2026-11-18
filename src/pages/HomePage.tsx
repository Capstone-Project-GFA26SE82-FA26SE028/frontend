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

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <section aria-labelledby="home-banner-title" className="w-full">
          <div className="grid items-center overflow-hidden rounded-2xl bg-[#164B3B] text-white shadow-lg shadow-emerald-950/5 sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">
            <div className="px-6 pt-8 pb-5 sm:px-10 sm:py-10 lg:pr-0 lg:pl-12">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c7df9e]">
                Kết nối trải nghiệm ẩm thực
              </p>
              <h1
                id="home-banner-title"
                className="text-3xl font-semibold leading-[1.2] tracking-tight sm:text-4xl xl:text-5xl"
              >
                Nhiều nhà hàng.
                <br />
                <span className="text-[#c7df9e]">Một điểm kết nối.</span>
              </h1>
              <p className="mt-5 text-sm leading-6 text-white/80 sm:text-base">
                Xem menu · Đặt món · Đặt bàn
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/restaurants"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#c7df9e] px-6 py-3 text-sm font-bold text-[#123d30] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Xem nhà hàng
                  <Icon name="arrow" size={18} />
                </Link>
                <Link
                  to="/reservation"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Đặt bàn
                </Link>
              </div>
            </div>
            <img
              src="/images/dinelink-platform.png"
              alt="Không tìm thấy ảnh"
              width={1448}
              height={1086}
              fetchPriority="high"
              className="h-auto w-full"
            />
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
