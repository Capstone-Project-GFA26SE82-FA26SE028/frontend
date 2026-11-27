import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { TakeawayOrderItem } from '../types/types'

export function TakeawayOrderItems({ items }: { items: TakeawayOrderItem[] }) {
  const [expanded, setExpanded] = useState(false)
  const [failedImages, setFailedImages] = useState<string[]>([])
  const visibleItems = expanded ? items : items.slice(0, 1)

  if (!items.length) return <p className="py-4 text-sm text-muted">Đơn mang đi</p>

  return (
    <div className="py-1">
      <ul className="divide-y divide-stone-100">
        {visibleItems.map((item) => (
          <li key={item.orderItemId} className="flex items-start gap-3 py-3 text-sm">
            <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-mint text-brand" aria-hidden="true">
              {item.imageUrl && /^https?:\/\//i.test(item.imageUrl) && !failedImages.includes(item.imageUrl) ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="size-full object-cover"
                  onError={(event) => {
                    const url = event.currentTarget.getAttribute('src')
                    if (url) setFailedImages((images) => [...images, url])
                  }}
                />
              ) : (
                <Icon name="utensils" size={18} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="break-words font-medium">{item.nameSnapshot}</p>
                <span className="shrink-0 text-muted">×{item.quantity}</span>
              </div>
              {!!item.options?.length && (
                <p className="mt-1 break-words text-xs text-muted">
                  {item.options.map((option) => option.quantity > 1 ? `${option.name} ×${option.quantity}` : option.name).join(', ')}
                </p>
              )}
              <p className="mt-1 text-right font-semibold text-brand">{formatCurrency(item.lineTotal)}</p>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 1 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="mx-auto flex min-h-9 items-center gap-1 text-sm text-muted hover:text-brand"
        >
          {expanded ? 'Thu gọn' : `Xem thêm ${items.length - 1} món`}
          <Icon name="chevron" size={14} className={expanded ? '-rotate-90' : 'rotate-90'} />
        </button>
      )}
    </div>
  )
}
