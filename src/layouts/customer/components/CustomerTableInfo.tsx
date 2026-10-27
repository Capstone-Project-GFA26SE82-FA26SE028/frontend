import { Icon } from '../../../components/Icon/Icon'
import { useAppSelector } from '../../../app/hooks'
export function CustomerTableInfo() {
  const table = useAppSelector((state) => state.customerSession.table)
  if (!table) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-5 text-xs">
      <div className="flex items-center gap-2 text-muted">
        <Icon name="pin" size={16} />
        <span>Your table</span>
        <span className="mx-1 text-stone-300">/</span>
        <strong className="text-brand">Table {table.tableCode}</strong>
      </div>
      <span className="flex items-center gap-2 rounded-full bg-mint px-3 py-1.5 text-brand">
        <span className="size-1.5 rounded-full bg-brand" />
        Dine-in menu
      </span>
    </div>
  )
}
