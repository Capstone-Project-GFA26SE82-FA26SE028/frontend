import { useState } from 'react'
import { ReservationBanner } from '../components/ReservationBanner'
import { ReservationForm } from '../components/ReservationForm'
import { ReservationSuccess } from '../components/ReservationSuccess'

export function ReservationPage() {
  const [done, setDone] = useState(false)

  return (
    <section className="grid gap-0 pt-1 pb-8 lg:grid-cols-2 lg:gap-8 lg:py-6 lg:pb-12">
      <ReservationBanner />
      <div className="relative z-10 -mt-5 rounded-3xl border border-stone-200/70 bg-white p-5 shadow-lg shadow-brand/5 min-[400px]:p-6 lg:mt-0 lg:p-8 lg:shadow-none">
        {done ? (
          <ReservationSuccess onReset={() => setDone(false)} />
        ) : (
          <ReservationForm onSuccess={() => setDone(true)} />
        )}
      </div>
    </section>
  )
}
