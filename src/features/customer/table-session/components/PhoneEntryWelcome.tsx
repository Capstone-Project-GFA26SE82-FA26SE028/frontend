import { Icon } from '../../../../components/Icon/Icon'
export function PhoneEntryWelcome() {
  return (
    <header className="relative isolate overflow-hidden bg-brand-dark px-7 pt-[max(2rem,env(safe-area-inset-top))] pb-12 text-white lg:flex lg:flex-col lg:px-10 lg:pt-10 lg:pb-0 xl:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full border border-white/10 lg:size-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 -right-10 size-40 rounded-full border border-white/10 lg:size-64"
      />
      <div className="relative flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
          <Icon name="leaf" size={25} />
        </span>
        <span className="text-3xl font-bold tracking-tight">mộc.</span>
        <span className="ml-auto hidden text-[10px] font-medium uppercase tracking-[.2em] text-lime-100/80 lg:block">
          Bếp tươi lành · Vị an nhiên
        </span>
      </div>
      <p className="relative mt-9 text-xs font-semibold uppercase tracking-[.16em] text-lime-200 lg:mt-12">
        Chào bạn, mời ghé Mộc
      </p>
      <h1 className="relative mt-3 text-[32px] leading-[1.4] font-semibold lg:text-[40px] xl:text-[44px]">
        Bữa ngon của bạn
        <span className="block font-sans italic text-lime-100">
          bắt đầu từ đây.
        </span>
      </h1>
      <p className="relative mt-4 hidden max-w-sm text-sm leading-7 text-white/75 lg:block">
        Một chút tươi lành, một chút an nhiên.
        <br />
        Mời bạn ngồi xuống, để Mộc chăm chút bữa ngon.
      </p>
      <div className="relative mt-8 -mr-10 -ml-10 hidden min-h-60 flex-1 overflow-hidden lg:block xl:-mr-12 xl:-ml-12">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/images/menu/salmon.jpg"
          />
          <img
            src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
            alt="Cá hồi áp chảo cùng rau xanh tại Mộc"
            width={900}
            height={1350}
            className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-brand-dark via-transparent to-black/30"
        />
        <div className="absolute right-8 bottom-7 left-8 flex items-center justify-between gap-4 text-xs text-white">
          <span className="flex items-center gap-2 rounded-full border border-white/25 bg-brand-dark/80 px-4 py-2.5 backdrop-blur-sm">
            <Icon name="utensils" size={16} />
            Được chăm chút từ căn bếp Mộc
          </span>
          <Icon name="leaf" size={25} />
        </div>
      </div>
    </header>
  )
}
