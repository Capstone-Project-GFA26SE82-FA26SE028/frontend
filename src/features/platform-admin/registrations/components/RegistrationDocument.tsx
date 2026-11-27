import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getRegistrationDocument,
  registrationError,
} from '../api/registrationApi'

export function RegistrationDocument({
  id,
  kind,
  title,
}: {
  id: string
  kind: 'business' | 'food-safety'
  title: string
}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const fullRef = useRef<HTMLAnchorElement>(null)
  const [failed, setFailed] = useState(false)
  const document = useQuery({
    queryKey: ['registration-documents', id, kind],
    queryFn: ({ signal }) => getRegistrationDocument(id, kind, signal),
    gcTime: 0,
    retry: false,
  })
  useEffect(() => {
    if (!document.data) return
    const objectUrl = URL.createObjectURL(document.data)
    if (imageRef.current) imageRef.current.src = objectUrl
    if (linkRef.current) linkRef.current.href = objectUrl
    if (fullRef.current) fullRef.current.href = objectUrl
    return () => URL.revokeObjectURL(objectUrl)
  }, [document.data, failed])
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {document.isPending ? (
        <p role="status" className="text-sm text-slate-500">
          Đang tải giấy tờ…
        </p>
      ) : document.isError || failed ? (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-rose-700">
            {failed
              ? 'Không thể hiển thị ảnh giấy tờ.'
              : registrationError(document.error)}
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              setFailed(false)
              void document.refetch()
            }}
          >
            Thử lại
          </button>
        </div>
      ) : (
        document.data && (
          <>
            <a
              ref={linkRef}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg focus-visible:outline-2 focus-visible:outline-emerald-700"
              aria-label={`Mở ảnh ${title} trong tab mới`}
            >
              <img
                ref={imageRef}
                alt={title}
                onError={() => setFailed(true)}
                className="h-56 w-full rounded-lg bg-slate-50 object-contain"
              />
            </a>
            <a
              ref={fullRef}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline"
            >
              Mở ảnh kích thước đầy đủ ↗
            </a>
          </>
        )
      )}
    </section>
  )
}
