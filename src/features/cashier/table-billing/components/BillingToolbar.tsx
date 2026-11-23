import { useEffect, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Icon } from '../../../../components/Icon/Icon'

const actionStyle =
  'flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-700 disabled:opacity-50'

export function BillingToolbar({
  openedAt,
  searchInput,
  refreshing,
  onRefresh,
}: {
  openedAt: string
  searchInput: RefObject<HTMLInputElement | null>
  refreshing: boolean
  onRefresh: () => void
}) {
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (
        event.key !== 'F2' ||
        event.defaultPrevented ||
        document.querySelector('dialog[open]')
      )
        return
      event.preventDefault()
      searchInput.current?.focus()
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [searchInput])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      toast.info('Trình duyệt chưa cho phép mở toàn màn hình.')
    }
  }

  return (
    <header className="flex justify-end">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 hidden text-xs text-slate-500 lg:inline">
          F2 Tìm bàn
        </span>
        <button
          type="button"
          aria-label="Làm mới danh sách"
          title="Làm mới"
          className={actionStyle}
          disabled={refreshing}
          onClick={onRefresh}
        >
          <Icon name="refresh" size={18} />
        </button>
        <button
          type="button"
          aria-label="Bật hoặc tắt toàn màn hình"
          title="Toàn màn hình"
          className={actionStyle}
          onClick={() => void toggleFullscreen()}
        >
          <Icon name="monitor" size={18} />
        </button>
        <Link
          to="/cashier"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:text-emerald-700"
        >
          <span className="size-2 rounded-full bg-emerald-500" />
          Ca mở{' '}
          {new Date(openedAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          <Icon name="chevron" size={14} />
        </Link>
      </div>
    </header>
  )
}
