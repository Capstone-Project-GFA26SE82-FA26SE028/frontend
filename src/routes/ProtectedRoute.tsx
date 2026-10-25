import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { clearSession, restoreSession } from '../features/auth/api/authApi'
export function ProtectedRoute() {
  const { session, status, error } = useAppSelector((state) => state.auth)
  const location = useLocation()
  useEffect(() => {
    if (status === 'checking') void restoreSession()
  }, [status])
  if (!session)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  if (status === 'checking')
    return (
      <p role="status" className="p-8 text-center">
        Checking your session…
      </p>
    )
  if (status === 'error')
    return (
      <main className="mx-auto max-w-lg space-y-4 p-8">
        <p role="alert">{error}</p>
        <button className="btn-primary" onClick={() => void restoreSession()}>
          Try again
        </button>
        <button className="btn-secondary" onClick={clearSession}>
          Back to sign in
        </button>
      </main>
    )
  return <Outlet />
}
