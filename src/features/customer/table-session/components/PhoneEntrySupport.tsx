import { Icon } from '../../../../components/Icon/Icon'
export function PhoneEntrySupport() {
  return (
    <div className="mt-auto pt-8 lg:mt-10 lg:border-t lg:border-stone-200/70 lg:pt-6">
      <p className="flex items-center justify-center gap-2 text-xs text-brand">
        <Icon name="heart" size={15} />
        Bếp tươi lành · Vị an nhiên
      </p>
      <p className="mt-4 text-center text-xs leading-5 text-muted">
        Bạn cần hỗ trợ? Hãy nhờ nhân viên tại bàn giúp bạn nhé.
      </p>
    </div>
  )
}
