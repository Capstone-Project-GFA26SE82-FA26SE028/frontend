import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'

export function CustomerSessionGate() {
  const { phone, qrContext } = useAppSelector((state) => state.customerSession)
  const { search } = useLocation()
  if (!phone || (search && search !== qrContext)) {
    return <Navigate to={{ pathname: '/welcome', search }} replace />
  }
  return <Outlet />
}
