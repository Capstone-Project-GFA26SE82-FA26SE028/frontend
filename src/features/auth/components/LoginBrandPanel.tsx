import { Link } from 'react-router-dom'

export function LoginBrandPanel() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-[#123d30] p-6 text-white sm:p-8 md:min-h-[580px] md:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-16 -z-10 size-96 rounded-full bg-emerald-300/10 blur-3xl" />
      <Link to="/login" className="w-fit text-2xl font-bold tracking-tight">
        FoodHub<span className="text-[#b8df8d]">.</span>
      </Link>

      <div className="hidden flex-1 flex-col items-center justify-center md:flex">
          <img
            src="/images/login-dining.svg"
            alt="Illustration of a salad plate with cutlery"
            width={400}
            height={380}
            className="w-full max-w-[380px]"
          />
        <div aria-hidden="true" className="mt-6 h-1 w-10 rounded-full bg-[#b8df8d]/70" />
      </div>
    </section>
  )
}
