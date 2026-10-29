import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Icon } from '../../components/Icon/Icon'
import { useAppSelector } from '../../app/hooks'
import { useKds } from '../../features/kitchen/kds/hooks/useKds'
import { KdsProvider } from '../../features/kitchen/kds/components/KdsProvider'
import { KdsWorkspaceHeader } from '../../features/kitchen/kds/components/KdsWorkspaceHeader'

export function KitchenLayout() {
  const userId = useAppSelector((s) => s.auth.session?.user.userId)
  return (
    <KdsProvider key={userId}>
      <KitchenWorkspace />
    </KdsProvider>
  )
}

function KitchenWorkspace() {
  const { state, pending, loading, errors, dismissFeedback, stations } =
    useKds()
  useEffect(() => {
    const old = document.title
    document.title = 'FoodHub · Kitchen display'
    return () => {
      document.title = old
    }
  }, [])
  useEffect(() => {
    if (!state.feedback) return
    const timer = setTimeout(dismissFeedback, 6500)
    return () => clearTimeout(timer)
  }, [state.feedback, dismissFeedback])
  return (
    <div lang="vi" className="min-h-dvh bg-[#f2f8fa] text-[#253754]">
      <a
        href="#kitchen-main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4"
      >
        Đến nội dung màn hình bếp
      </a>
      <KdsWorkspaceHeader />
      <main id="kitchen-main" className="mx-auto max-w-[1920px] p-3 sm:p-6">
        {(loading || pending) && (
          <p role="status" className="mb-3 text-sm text-emerald-800">
            {pending ? 'Đang lưu…' : 'Đang tải dữ liệu bếp…'}
          </p>
        )}
        {errors.length > 0 && (
          <div
            role="alert"
            className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800"
          >
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
        {!loading && !errors.length && !stations.length && (
          <p role="status" className="mb-4">
            Chưa có trạm bếp đang hoạt động.
          </p>
        )}
        <fieldset className="min-w-0" disabled={pending} aria-busy={pending}>
          <Outlet />
        </fieldset>
      </main>
      {state.feedback && (
        <div
          role={state.feedback.error ? 'alert' : 'status'}
          className={`fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl p-4 text-sm text-white shadow-xl sm:max-w-sm ${state.feedback.error ? 'bg-rose-800' : 'bg-slate-900'}`}
        >
          <span>{state.feedback.text}</span>
          <button aria-label="Đóng thông báo" onClick={dismissFeedback}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
