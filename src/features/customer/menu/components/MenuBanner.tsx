import { Icon } from '../../../../components/Icon/Icon'
export function MenuBanner() {
  return (
    <section className="relative isolate flex min-h-40 items-center overflow-hidden rounded-3xl bg-brand-dark px-5 py-6 text-white sm:min-h-52 sm:px-9">
      <div className="relative z-10 max-w-[65%]">
        <h1 className="text-2xl font-semibold leading-tight sm:text-4xl">
          Thực đơn tại bàn
        </h1>
        <button
          type="button"
          onClick={() => {
            const target = document.getElementById('thuc-don')
            const reduceMotion = window.matchMedia(
              '(prefers-reduced-motion: reduce)',
            ).matches
            target?.scrollIntoView({
              behavior: reduceMotion ? 'instant' : 'smooth',
            })
          }}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#e1edc7] px-4 text-sm font-semibold text-brand-dark hover:bg-[#eef6db]"
        >
          Xem thực đơn
          <Icon name="chevron" size={15} className="rotate-90" />
        </button>
      </div>
      <img
        src="/images/login-dining.svg"
        alt=""
        className="pointer-events-none absolute right-0 top-1/2 w-[42%] max-w-64 -translate-y-1/2 object-contain opacity-60 sm:right-5 sm:opacity-100"
      />
    </section>
  )
}
