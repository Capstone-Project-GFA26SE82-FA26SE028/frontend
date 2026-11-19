import { useState } from 'react'

export function UserAvatar({
  src,
  name,
  large = false,
}: {
  src?: string | null
  name: string
  large?: boolean
}) {
  const [failedUrl, setFailedUrl] = useState<string>()
  const url = src?.trim()
  const showImage = !!url && /^https?:\/\//i.test(url) && url !== failedUrl
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 font-semibold text-emerald-700 ${large ? 'size-20 text-2xl' : 'size-10 text-sm'}`}
    >
      {showImage ? (
        <img
          src={url}
          alt={`Ảnh đại diện của ${name || 'Người dùng'}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        <span aria-label={`Ảnh đại diện của ${name || 'Người dùng'}`}>
          {name.trim().split(/\s+/).at(-1)?.[0]?.toUpperCase() || '?'}
        </span>
      )}
    </span>
  )
}
