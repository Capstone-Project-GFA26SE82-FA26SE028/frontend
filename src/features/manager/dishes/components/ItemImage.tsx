import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'

export function ItemImage({
  src,
  name,
  className,
}: {
  src?: string | null
  name: string
  className: string
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-emerald-50 text-emerald-700 ${className}`}
    >
      {src && src !== failedUrl ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          loading="lazy"
          onError={() => setFailedUrl(src)}
        />
      ) : (
        <Icon name="utensils" size={28} />
      )}
    </span>
  )
}
