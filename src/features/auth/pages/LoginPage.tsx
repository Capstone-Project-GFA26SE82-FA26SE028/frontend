import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { clearSession, restoreSession } from '../api/authApi'
import { LoginForm } from '../components/LoginForm'
import { LogoutButton } from '../components/LogoutButton'
import { BrandLogo } from '../../../components/BrandLogo/BrandLogo'
import { Icon } from '../../../components/Icon/Icon'
import { BrandBackground } from '../../../components/BrandBackground/BrandBackground'

export function LoginPage() {
  const { session, status, error } = useAppSelector((state) => state.auth)
  const location = useLocation()
  useEffect(() => {
    if (status === 'checking') void restoreSession()
  }, [status])
  const state = location.state as {
    from?: string
    warning?: string
    email?: string
  } | null
  if (session?.user.roleId === 'customer' && status === 'authenticated') {
    if (
      state?.from &&
      /^\/restaurants\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(menu|cart)$/i.test(
        state.from,
      )
    )
      return <Navigate to={state.from} replace />
    return (
      <Navigate
        to={state?.from === '/reservation' ? '/reservation' : '/'}
        replace
      />
    )
  }
  if (session?.user.roleId === 'kitchen' && status === 'authenticated') {
    return <Navigate to="/kitchen" replace />
  }
  if (session?.user.roleId === 'manager' && status === 'authenticated') {
    const from = state?.from
    return (
      <Navigate
        to={
          from && (from === '/manager' || from.startsWith('/manager/'))
            ? from
            : '/manager'
        }
        replace
      />
    )
  }
  if (session?.user.roleId === 'admin' && status === 'authenticated') {
    const from = state?.from
    const target =
      from && (from === '/admin' || from.startsWith('/admin/'))
        ? from
        : '/admin'
    return <Navigate to={target} replace />
  }
  return (
    <main
      lang="vi"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center bg-[#123d30] px-4 pt-24 pb-8 text-[#173e32] sm:pb-12"
    >
      <BrandBackground />
      <Link
        to="/"
        className="absolute top-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:top-6 sm:left-6"
      >
        <Icon name="arrow" size={16} className="rotate-180" />
        Trang chủ
      </Link>
      <Link
        to="/"
        aria-label="DineLink - Trang chủ"
        className="mb-7 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <BrandLogo />
      </Link>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/15">
        <section className="px-6 py-8 sm:px-9 sm:py-10">
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Đăng nhập DineLink
          </h1>
          {state?.warning && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
            >
              {state.warning}
            </p>
          )}
          {status === 'authenticated' && session ? (
            <div className="mt-6 space-y-4">
              <p
                role="alert"
                className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
              >
                Chưa có giao diện dành cho vai trò của bạn.
              </p>
              <LogoutButton />
            </div>
          ) : status === 'checking' ? (
            <p role="status" className="py-10">
              Đang kiểm tra phiên đăng nhập…
            </p>
          ) : status === 'error' ? (
            <div className="mt-6 space-y-4">
              <p role="alert">{error}</p>
              <button
                className="btn-primary w-full"
                onClick={() => void restoreSession()}
              >
                Thử lại
              </button>
              <button className="btn-secondary w-full" onClick={clearSession}>
                Đăng nhập bằng tài khoản khác
              </button>
            </div>
          ) : (
            <LoginForm initialEmail={state?.email} />
          )}
        </section>
      </div>
    </main>
  )
}
