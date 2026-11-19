import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
export function RoleRoute({ roles }: { roles: string[] }) {
  const user = useAppSelector((state) => state.auth.session?.user)
  if (!user) return <Navigate to="/login" replace />
  return roles.includes(user.roleId) ? (
    <Outlet />
  ) : (
    <main
      lang="vi"
      className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 px-6 text-center"
    >
      <h1 className="text-2xl font-bold">Bạn không có quyền truy cập</h1>
      <p className="text-sm text-muted">
        Tài khoản của bạn không được phép sử dụng trang này.
      </p>
      <Link to="/login" className="btn-primary">
        Về trang của bạn
      </Link>
    </main>
  )
}
