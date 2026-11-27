import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'

export function CashHandoverModal({
  table,
  formattedTotal,
  children,
}: {
  table: string
  formattedTotal: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function openWithShortcut(event: KeyboardEvent) {
      if (
        event.key !== 'F8' || event.defaultPrevented || event.repeat ||
        event.ctrlKey || event.altKey || event.metaKey || event.shiftKey ||
        document.querySelector('dialog[open]')
      ) return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener('keydown', openWithShortcut)
    return () => window.removeEventListener('keydown', openWithShortcut)
  }, [])

  return (
    <div className="bg-slate-50/50 px-4 pb-4">
      <button
        type="button"
        aria-keyshortcuts="F8"
        className="flex min-h-13 w-full items-center gap-2.5 rounded-xl bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        onClick={() => setOpen(true)}
      >
        <Icon name="check" size={19} />
        <span className="flex-1 text-left">Xác nhận nhận tiền mặt</span>
        <kbd className="rounded-md bg-white/15 px-2 py-1 text-xs">F8</kbd>
      </button>
      {open && (
        <Modal title="Xác nhận nhận tiền mặt" subtitle={table} onClose={() => setOpen(false)}>
          <div className="flex items-center justify-between gap-3 bg-emerald-50 px-5 py-4">
            <span className="text-sm font-medium text-emerald-900">Khách cần trả</span>
            <strong className="text-xl text-emerald-900">{formattedTotal}</strong>
          </div>
          {children}
        </Modal>
      )}
    </div>
  )
}
