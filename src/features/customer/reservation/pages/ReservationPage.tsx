import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { ReservationBanner } from '../components/ReservationBanner'
import { ReservationForm } from '../components/ReservationForm'
import { ReservationSuccess } from '../components/ReservationSuccess'

export function ReservationPage() {
  const [done, setDone] = useState(false)

  return (
    <div lang="vi" className="flex min-h-dvh flex-col bg-[#faf9f6] text-ink">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-brand-dark"
        >
          FoodHub<span className="text-emerald-500">.</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-white hover:text-brand"
        >
          <span className="rotate-180">
            <Icon name="arrow" size={16} />
          </span>
          Trang chủ
        </Link>
      </header>
      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-7 px-5 pb-8 pt-3 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:pt-8">
        <ReservationBanner />
        <div className="min-w-0 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xl shadow-emerald-950/[0.03] sm:p-8">
          {done ? (
            <ReservationSuccess onReset={() => setDone(false)} />
          ) : (
            <ReservationForm onSuccess={() => setDone(true)} />
          )}
        </div>
      </main>
      <footer className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-slate-500 sm:px-8">
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
