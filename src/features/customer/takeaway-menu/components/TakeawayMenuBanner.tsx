import { Icon } from '../../../../components/Icon/Icon'

export function TakeawayMenuBanner({
  name,
  address,
}: {
  name: string
  address: string
}) {
  return (
    <section className="mb-7 rounded-3xl bg-[#164B3B] px-6 py-7 text-white sm:px-9">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#d7e9b7]">
        <Icon name="bag" size={16} />
        Đặt món mang đi
      </p>
      <h1 className="break-words text-3xl font-bold">{name}</h1>
      {address && (
        <p className="mt-3 flex items-start gap-2 text-sm text-white/75">
          <Icon name="pin" size={16} className="shrink-0" />
          {address}
        </p>
      )}
    </section>
  )
}
