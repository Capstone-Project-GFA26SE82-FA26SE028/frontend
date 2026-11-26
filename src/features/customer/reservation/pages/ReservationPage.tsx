import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { BrandBackground } from '../../../../components/BrandBackground/BrandBackground'
import { ReservationForm } from '../components/ReservationForm'
import { ReservationSuccess } from '../components/ReservationSuccess'
import type { CreatedReservation } from '../api/reservationApi'

export function ReservationPage() {
  const [done, setDone] = useState<CreatedReservation | null>(null)

  return (
    <div
      lang="vi"
      className="relative isolate flex min-h-dvh flex-col bg-[#123d30] text-ink"
    >
      <BrandBackground />
      <HomeHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-10">
        <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/15 sm:p-9">
          {done ? (
            <ReservationSuccess reservation={done} onReset={() => setDone(null)} />
          ) : (
            <ReservationForm onSuccess={setDone} />
          )}
        </div>
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/70 sm:px-8">
        <span>DineLink</span>
        <a
          href="mailto:foodhub@gmail.com"
          className="flex items-center gap-2 underline-offset-4 hover:text-white hover:underline"
        >
          <Icon name="mail" size={14} />
          foodhub@gmail.com
        </a>
      </footer>
    </div>
  )
}
