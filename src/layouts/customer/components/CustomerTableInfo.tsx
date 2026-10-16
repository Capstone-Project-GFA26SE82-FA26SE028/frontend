import { Icon } from '../../../components/Icon/Icon'

export function CustomerTableInfo() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-5 text-xs">
      <div className="flex items-center gap-2 text-muted">
        <Icon name="pin" size={16} />
        <span>Mộc · Không gian vườn</span>
        <span className="mx-1 text-stone-300">/</span>
        <strong className="text-brand">Bàn 08</strong>
      </div>
      <span className="flex items-center gap-2 rounded-full bg-mint px-3 py-1.5 text-brand">
        <span className="size-1.5 rounded-full bg-brand" />
        Thực đơn tại bàn
      </span>
    </div>
  )
}
