import { Icon } from '../../../../components/Icon/Icon'

type MenuBannerProps = {
  image: string
}

export function MenuBanner({ image }: MenuBannerProps) {
  return (
    <section className="relative isolate grid overflow-hidden rounded-3xl bg-brand-dark text-white md:grid-cols-[1.08fr_1fr] md:rounded-[2rem]">
      <div className="relative z-10 px-5 pt-32 pb-6 min-[400px]:px-6 md:p-10 lg:p-12">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.1em] text-lime-200 md:mb-6 md:text-xs md:tracking-[.18em]">
          <span className="h-px w-4 shrink-0 bg-lime-200 md:w-7" />
          Tươi từ nguyên liệu · Trọn vị từ tâm
        </div>
        <h1 className="max-w-lg text-[28px] leading-[1.18] font-semibold tracking-tight min-[400px]:text-[32px] md:text-5xl lg:text-[56px]">
          Ăn ngon một chút.
          <br />
          <span className="font-serif italic text-[#d9e9bc]">
            Vui thêm một ngày.
          </span>
        </h1>
        <p className="mt-5 hidden max-w-sm text-sm leading-7 text-white/75 md:block">
          Gác lại những vội vàng. Cùng Mộc thưởng thức một bữa ăn tươi lành,
          đúng vị bạn yêu.
        </p>
        <a
          href="#thuc-don"
          className="mt-5 inline-flex min-h-12 items-center gap-4 rounded-full md:mt-7 bg-[#e1edc7] px-6 py-3 text-sm font-bold text-brand-dark hover:bg-white"
        >
          Khám phá thực đơn <Icon name="arrow" size={18} />
        </a>
        <div className="mt-9 hidden flex-wrap items-center gap-5 text-xs text-white/80 md:flex">
          <span className="flex items-center gap-2">
            <Icon name="leaf" size={16} />
            Nguyên liệu tươi mỗi ngày
          </span>
          <span className="flex items-center gap-2">
            <Icon name="heart" size={16} />
            Chế biến bằng sự tận tâm
          </span>
        </div>
      </div>
      <div className="absolute inset-0 md:relative md:inset-auto md:min-h-full">
        <img
          src={image}
          alt="Cá hồi áp chảo cùng rau củ tươi từ căn bếp Mộc"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/5 md:bg-gradient-to-r md:from-brand-dark md:via-brand-dark/10 md:to-transparent" />
        <div className="absolute right-6 bottom-6 hidden rounded-2xl md:block border border-white/30 bg-white/95 px-5 py-4 text-ink shadow-lg">
          <div className="flex items-center gap-2 text-xs text-brand">
            <Icon name="star" size={16} />
            Món ngon đáng thử
          </div>
          <p className="mt-1 font-semibold">Cá hồi áp chảo sốt chanh</p>
          <p className="mt-1 text-xs text-muted">
            Một chút tinh tế cho bữa ăn của bạn
          </p>
        </div>
      </div>
    </section>
  )
}
