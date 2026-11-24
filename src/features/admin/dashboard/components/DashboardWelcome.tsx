import { useEffect, useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { useAppSelector } from '../../../../app/hooks'

export function DashboardWelcome({ restaurantName }: { restaurantName?: string | null }) {
  const name = useAppSelector((state) =>
    state.auth.session?.user.fullName?.trim(),
  )
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <section className="rounded-2xl bg-[#123d30] px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-emerald-200">
            {restaurantName || 'Tổng quan nhà hàng'}
          </p>
          <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Xin chào, {name}!
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white sm:self-auto">
          <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-emerald-100">
            <Icon name="calendar" size={17} />
          </span>
          <div>
            <p className="text-xs text-emerald-100 capitalize">
              {now.toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'Asia/Ho_Chi_Minh',
              })}
            </p>
            <time
              dateTime={now.toISOString()}
              className="mt-0.5 block text-base font-semibold tabular-nums"
            >
              {now.toLocaleTimeString('vi-VN', {
                hour12: false,
                timeZone: 'Asia/Ho_Chi_Minh',
              })}
            </time>
          </div>
        </div>
      </div>
    </section>
  )
}
