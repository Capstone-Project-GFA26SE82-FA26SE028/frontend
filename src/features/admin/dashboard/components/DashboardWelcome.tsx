import { useEffect, useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'

export function DashboardWelcome() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-emerald-100/80 bg-gradient-to-r from-[#f0faf5] via-[#e8f7ef] to-[#dbf1e5] px-5 py-5 sm:px-6">
      <RestaurantIllustration />
      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-200/50 text-emerald-700">
            <Icon name="leaf" size={22} />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">
              Xin chào, Admin!{' '}
              <span className="inline-block" aria-hidden="true">
                👋
              </span>
            </h2>
            <p className="mt-1.5 max-w-80 text-sm leading-6 text-emerald-800 sm:max-w-none">
              Đây là tổng quan hoạt động và cấu hình nhà hàng của bạn.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-2.5 pl-[52px] text-emerald-900 sm:pl-0 lg:rounded-xl lg:bg-white/40 lg:px-3 lg:py-2">
          <Icon name="calendar" size={20} className="mt-0.5" />
          <div>
            <p className="text-xs capitalize">
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
              className="mt-1 block text-sm font-bold tabular-nums"
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

function RestaurantIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 150"
      className="pointer-events-none absolute right-[17%] bottom-0 -z-0 hidden h-full max-h-36 w-[36%] text-emerald-700 opacity-65 xl:block"
      fill="none"
    >
      <ellipse cx="221" cy="149" rx="191" ry="13" fill="#bddfc8" />
      <path d="M37 139V81M371 143V77" stroke="#568f63" strokeWidth="5" />
      <path
        d="M15 92C-2 73 21 49 31 47C31 21 53 16 63 43C87 48 88 79 69 92C54 110 25 109 15 92Z"
        fill="#77be7e"
      />
      <path
        d="M349 100C321 96 327 71 341 61C339 35 363 27 377 48C407 37 424 71 402 88C406 113 368 124 349 100Z"
        fill="#66ae70"
      />
      <path d="M100 49L269 16L340 43V139H100V49Z" fill="#f9faf0" />
      <path d="M269 16L340 43V139H269V16Z" fill="#c6dfad" />
      <path d="M88 44L269 6L351 35V49L269 22L88 58V44Z" fill="#4f9b5b" />
      <path d="M100 41L267 9L339 36" stroke="#b8e4b1" strokeWidth="4" />
      <path d="M118 88H161V139H118V88ZM177 75H245V139H177V75Z" fill="#f6d899" />
      <path d="M125 94H155V135H125V94ZM185 83H237V135H185V83Z" fill="#e1f3df" />
      <path
        d="M211 82V138M287 72L321 81V139H287V72Z"
        stroke="#75ab7e"
        strokeWidth="5"
      />
      <path d="M108 76L252 52L264 75L104 99L108 76Z" fill="#fbfff7" />
      <path
        d="M108 76L128 73L124 95L104 99ZM151 69L172 65L174 87L151 91ZM196 61L217 58L223 80L199 84ZM239 54L252 52L264 75L246 77Z"
        fill="#68b477"
      />
      <path d="M283 52L332 67V84L283 69V52Z" fill="#6eae6a" />
      <path d="M160 40L244 24V46L160 62V40Z" fill="#e8f5d9" />
      <path d="M102 139H342" stroke="#639e64" strokeWidth="6" />
      <rect x="72" y="128" width="27" height="22" rx="4" fill="#dec38a" />
      <circle cx="85" cy="119" r="19" fill="#6db777" />
      <rect x="326" y="132" width="29" height="18" rx="3" fill="#d4b87d" />
      <circle cx="340" cy="122" r="17" fill="#7bbb70" />
      <path
        d="M39 142H73M357 142H399"
        stroke="#8bc58d"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  )
}
