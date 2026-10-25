import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { clearSession, restoreSession } from '../api/authApi'
import { LoginForm } from '../components/LoginForm'
import { LogoutButton } from '../components/LogoutButton'
import { LoginBrandPanel } from '../components/LoginBrandPanel'

export function LoginPage() {
  const { session, status, error } = useAppSelector((state) => state.auth)
  const location = useLocation()
  useEffect(() => {
    if (status === 'checking') void restoreSession()
  }, [status])
  const state = location.state as { from?: string; warning?: string } | null
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
      lang="en"
      className="flex min-h-dvh items-center justify-center bg-[#faf9f6] p-4 sm:p-8"
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-emerald-950/5 md:grid-cols-2">
        <LoginBrandPanel />
        <section className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-xs font-semibold tracking-widest text-brand">
            WELCOME BACK
          </p>
          <h2 className="mt-3 text-2xl font-bold">Sign In</h2>
          <p className="mt-3 text-sm text-muted">
            Enter your account details to continue.
          </p>
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
                A workspace for your role is not available yet.
              </p>
              <LogoutButton />
            </div>
          ) : status === 'checking' ? (
            <p role="status" className="py-10">
              Checking your session…
            </p>
          ) : status === 'error' ? (
            <div className="mt-6 space-y-4">
              <p role="alert">{error}</p>
              <button
                className="btn-primary w-full"
                onClick={() => void restoreSession()}
              >
                Try again
              </button>
              <button className="btn-secondary w-full" onClick={clearSession}>
                Sign in with another account
              </button>
            </div>
          ) : (
            <LoginForm />
          )}
        </section>
      </div>
    </main>
  )
}
