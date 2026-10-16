import { Icon } from '../../../components/Icon/Icon'

export function CustomerFooter() {
  return (
    <footer className="border-t border-stone-200 pb-28 md:pb-8">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 pt-7 text-xs text-muted sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <Icon name="leaf" className="text-brand" />
          <span>
            <strong className="text-brand">Mộc.</strong> Một bữa ăn ngon, một
            khoảng bình yên.
          </span>
        </div>
        <span>Cảm ơn bạn đã chọn Mộc. Chúc bạn ngon miệng!</span>
      </div>
    </footer>
  )
}
