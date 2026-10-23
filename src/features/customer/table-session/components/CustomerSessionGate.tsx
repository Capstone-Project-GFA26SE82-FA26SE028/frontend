import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { getGuestAccess, qrToken, sessionError } from '../api/tableSessionApi'
export function CustomerSessionGate() {
  const table = useAppSelector((s) => s.customerSession.table)
  const { search, hash } = useLocation()
  const incomingQr = !!qrToken(hash, search)
  const access = useQuery({
    queryKey: ['customer-guest-access', table?.tableSessionId],
    queryFn: ({ signal }) => getGuestAccess(table!.tableSessionId, signal),
    enabled: !!table && !incomingQr,
    retry: false,
    staleTime: 0,
    refetchInterval: 60000,
  })
  if (incomingQr || !table)
    return <Navigate to={{ pathname: '/welcome', search, hash }} replace />
  if (access.isPending)
    return (
      <p role="status" className="p-8 text-center">
        Checking table access...
      </p>
    )
  if (access.isError) {
    if (
      axios.isAxiosError(access.error) &&
      [401, 403, 404, 409].includes(access.error.response?.status || 0)
    )
      return <Navigate to="/welcome" replace />
    return (
      <div className="space-y-3 p-8 text-center">
        <p role="alert">{sessionError(access.error)}</p>
        <button className="btn-primary" onClick={() => void access.refetch()}>
          Try again
        </button>
      </div>
    )
  }
  if (access.data.tableSessionId !== table.tableSessionId)
    return <Navigate to="/welcome" replace />
  return <Outlet />
}
