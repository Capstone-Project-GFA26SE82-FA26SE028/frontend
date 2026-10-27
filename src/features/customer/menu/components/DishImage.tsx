import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
export function DishImage({
  src,
  name,
  className = '',
}: {
  src: string | null
  name: string
  className?: string
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  return (
    <div
      className={
        'flex items-center justify-center overflow-hidden bg-mint ' + className
      }
    >
      {src && /^https?:\/\//i.test(src) && failedUrl !== src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(src)}
        />
      ) : (
        <Icon name="utensils" size={40} className="text-brand/35" />
      )}
    </div>
  )
}
