import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon/Icon'

export function HomePage() {
  return (
    <div
      lang="vi"
      className="flex min-h-dvh flex-col bg-[#faf9f6] text-[#173e32]"
    >
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-7">
        <Link
          to="/"
          aria-label="FoodHub - Trang chủ"
          className="text-2xl font-bold tracking-tight"
        >
          FoodHub<span className="text-emerald-500">.</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold transition-colors hover:border-emerald-300 hover:bg-emerald-50 sm:text-sm"
        >
          <Icon name="users" size={16} />
          Đăng nhập nhân viên
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-8 sm:px-8 lg:py-12">
        <section className="grid w-full items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-full bg-[#123d30] shadow-[0_20px_60px_-25px_rgba(18,61,48,0.4)] sm:max-w-[380px] lg:order-2 lg:max-w-[460px]">
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
            <Link
              to="/reservation"
              className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-5 rounded-2xl bg-[#226449] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-[#184c37] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 lg:w-auto"
            >
              Đặt bàn ngay
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-slate-500 sm:px-8">
        <span>FoodHub</span>
        <a
          href="mailto:foodhub@gmail.com"
          className="flex items-center gap-2 underline-offset-4 hover:text-emerald-800 hover:underline"
        >
          <Icon name="mail" size={14} />
          foodhub@gmail.com
        </a>
      </footer>
    </div>
  )
}
