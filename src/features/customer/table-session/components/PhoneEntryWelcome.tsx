export function PhoneEntryWelcome() {
  return (
    <header className="relative isolate flex h-56 shrink-0 flex-col overflow-hidden md:h-auto bg-[#123d30] px-6 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-white sm:px-8 md:min-h-[580px] md:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 -z-10 size-96 rounded-full bg-emerald-300/10 blur-3xl"
      />
      <div className="relative z-10 w-fit text-2xl font-bold tracking-tight drop-shadow-sm">
        FoodHub<span className="text-[#b8df8d]">.</span>
      </div>
      <div className="absolute inset-x-0 bottom-2 top-14 flex items-center justify-center md:hidden">
        <img
          src="/images/login-dining.svg"
          alt="Illustration of a salad plate with cutlery"
          className="h-full w-auto max-w-full object-contain"
        />

      </div>
      <div className="hidden flex-1 flex-col items-center justify-center md:flex">
        <img
          src="/images/login-dining.svg"
          alt="Illustration of a salad plate with cutlery"
          width={400}
          height={380}
          className="w-full max-w-[380px]"
        />
        <div
          aria-hidden="true"
          className="mt-6 h-1 w-10 rounded-full bg-[#b8df8d]/70"
        />
      </div>
    </header>
  )
}
