import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import {
  getGuestAccess,
  qrToken,
  resolveTableQr,
  sessionError,
} from '../api/tableSessionApi'
export function CustomerSessionGate() {
  const table = useAppSelector((s) => s.customerSession.table)
  const { search, hash } = useLocation()
  const token = qrToken(hash, search)
  const incomingQr = !!token
  const validQr = /^[a-fA-F0-9]{64}$/.test(token)
  const resolved = useQuery({
    queryKey: ['customer-qr-resolve', token],
    queryFn: ({ signal }) => resolveTableQr(token, signal),
    enabled: !!table && validQr,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  })
  const matchingTable = !incomingQr || resolved.data?.tableId === table?.tableId
  const welcome = { pathname: '/welcome', search, hash }
  const access = useQuery({
    queryKey: ['customer-guest-access', table?.tableSessionId],
    queryFn: ({ signal }) => getGuestAccess(table!.tableSessionId, signal),
    enabled: !!table && matchingTable,
    retry: false,
    staleTime: 0,
    refetchInterval: 60000,
  })
  if (!table || (incomingQr && !validQr))
    return <Navigate to={welcome} replace />
  if (incomingQr && resolved.isError) {
    if (
      axios.isAxiosError(resolved.error) &&
      [400, 403, 404, 409].includes(resolved.error.response?.status || 0)
    )
      return <Navigate to={welcome} replace />
    return (
      <div className="space-y-3 p-8 text-center">
        <p role="alert">{sessionError(resolved.error)}</p>
        <button className="btn-primary" onClick={() => void resolved.refetch()}>
          Try again
        </button>
      </div>
    )
  }
  if (incomingQr && resolved.isPending)
    return (
      <p role="status" className="p-8 text-center">
        Checking table...
      </p>
    )
  if (!matchingTable) return <Navigate to={welcome} replace />
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
      return <Navigate to={welcome} replace />
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
    return <Navigate to={welcome} replace />
  return <Outlet />
}
