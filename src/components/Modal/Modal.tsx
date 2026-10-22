import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
export function Modal({
  title,
  children,
  onClose,
  size = 'default',
  subtitle,
  closeLabel = 'Đóng',
}: {
  title: string
  children: ReactNode
  onClose: () => void
  size?: 'default' | 'wide'
  subtitle?: string
  closeLabel?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    const before = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = before
    }
  }, [])
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`modal-scroll fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] ${size === 'wide' ? 'max-w-3xl' : 'max-w-lg'} overflow-y-auto rounded-3xl border-0 bg-white p-0 text-ink shadow-2xl`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white px-6 py-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label={closeLabel}
          className="flex size-11 items-center justify-center rounded-full hover:bg-mint"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  )
}
