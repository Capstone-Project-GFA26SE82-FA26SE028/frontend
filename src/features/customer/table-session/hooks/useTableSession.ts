import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../../app/hooks'
import {
  scanTable,
  joinTable,
  getGuestAccess,
  qrToken,
} from '../api/tableSessionApi'
import { enterSession, rememberTable } from '../sessionSlice'
export function useTableSession() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const client = useQueryClient()
  const token = qrToken(location.hash, location.search)
  const valid = /^[a-fA-F0-9]{64}$/.test(token)
  const scan = useQuery({
    queryKey: ['customer-table-scan', token],
    queryFn: ({ signal }) => scanTable(token, signal),
    enabled: valid,
    retry: false,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
  })
  const join = useMutation({
    retry: false,
    mutationFn: async (value: string) => {
      if (!scan.data || scan.data.status !== 'Open')
        throw new Error('Scan an active table QR code first.')
      await joinTable(scan.data.tableSessionId, value)
      // Verify the browser accepted the HttpOnly cookie before entering the menu.
      const access = await getGuestAccess(scan.data.tableSessionId)
      if (access.tableSessionId !== scan.data.tableSessionId)
        throw new Error('Table session mismatch. Scan the QR again.')
      return { table: scan.data, access }
    },
    onSuccess: ({ table, access }) => {
      rememberTable(table)
      dispatch(enterSession(table))
      client.setQueryData(
        ['customer-guest-access', table.tableSessionId],
        access,
      )
      navigate('/menu', { replace: true })
    },
  })
  return { token, valid, scan, join }
}
