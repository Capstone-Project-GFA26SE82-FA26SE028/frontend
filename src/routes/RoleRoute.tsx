import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
export function RoleRoute({ roles }: { roles: string[] }) {
  const user = useAppSelector((state) => state.auth.session?.user)
  if (!user) return <Navigate to="/login" replace />
  return roles.includes(user.roleId) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  )
}
