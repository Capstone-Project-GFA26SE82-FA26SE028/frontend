import { Icon } from '../../../../components/Icon/Icon'
export function MenuBanner() {
  return (
    <section className="relative isolate flex items-center justify-between overflow-hidden rounded-3xl bg-brand-dark p-6 text-white sm:p-9">
      <div className="relative z-10">
        <p className="text-xs font-semibold tracking-wider text-lime-200">
          MADE FOR YOUR TABLE
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
          Good food.
          <br />
          Great company.
        </h1>
        <a
          href="#thuc-don"
          className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-[#e1edc7] px-5 text-sm font-bold text-brand-dark"
        >
          Explore the menu
          <Icon name="arrow" size={16} />
        </a>
      </div>
      <img
        src="/images/login-dining.svg"
        alt=""
        className="pointer-events-none absolute -right-16 w-64 opacity-35 sm:static sm:w-60 sm:opacity-100"
      />
    </section>
  )
}
