import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { getTable } from '../api/tableApi'
import { getArea } from '../../areas/api/areaApi'
import { getRestaurant } from '../../restaurants/api/restaurantApi'
import { getCurrentQr, issueTableQr, getQrImage } from '../api/tableQrApi'
export function useTableQr(tableId: string) {
  const [confirm, setConfirm] = useState(false)
  const client = useQueryClient()
  const context = useQuery({
    queryKey: ['table-qr', 'table', tableId],
    queryFn: async ({ signal }) => {
      const table = await getTable(tableId, signal)
      const area = await getArea(table.areaId, signal)
      const restaurant = await getRestaurant(area.restaurantId, signal)
      const qr = await getCurrentQr(table.tableId, table.tableCode, signal)
      return { table, area, restaurant, qr }
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
  const current = context.data?.qr
  const picture = useQuery({
    queryKey: ['table-qr', 'image', current?.qrId],
    queryFn: ({ signal }) => getQrImage(current!.qrId, signal),
    enabled: !!current,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    retry: false,
    mutationFn: () => issueTableQr(tableId, current?.qrId),
    onSuccess: (qr) => {
      void client.invalidateQueries({
        queryKey: ['table-qr', 'status', tableId],
      })
      client.setQueryData(
        ['table-qr', 'table', tableId],
        (old: typeof context.data) => (old ? { ...old, qr } : old),
      )
      setConfirm(false)
      toast.success('Mã QR đã sẵn sàng.')
    },
  })
  const allowed =
    !!context.data?.table.isActive && !!context.data?.area.isActive
  async function reload() {
    const r = await context.refetch()
    if (r.isSuccess) {
      void client.invalidateQueries({
        queryKey: ['table-qr', 'status', tableId],
      })
      mutation.reset()
      setConfirm(false)
      void client.invalidateQueries({ queryKey: ['table-qr', 'image'] })
    }
  }
  function download() {
    if (!picture.data || !current) return
    const url = URL.createObjectURL(picture.data)
    const link = document.createElement('a')
    link.href = url
    link.download =
      'table-' + current.tableCode.replace(/[^a-zA-Z0-9_-]/g, '_') + '-qr.png'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return {
    context,
    current,
    picture,
    mutation,
    allowed,
    confirm,
    setConfirm,
    reload,
    download,
  }
}
