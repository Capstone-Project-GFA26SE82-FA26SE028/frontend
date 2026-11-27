import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import {
  getCurrentQr,
  issueTableQr,
  getQrImage,
  getQrTable,
  getQrArea,
} from '../api/tableQrApi'
export function useTableQr(tableId: string) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId || ''
  const actorId = user?.userId
  const canManage = !!restaurantId && user?.roleId === 'manager'
  const [confirm, setConfirm] = useState(false)
  const client = useQueryClient()
  const context = useQuery({
    queryKey: ['manager-table-qr', restaurantId, actorId, 'table', tableId],
    enabled: canManage,
    retry: false,
    queryFn: async ({ signal }) => {
      const table = await getQrTable(tableId, signal)
      const area = await getQrArea(table.areaId, signal)
      if (area.restaurantId !== restaurantId)
        throw new Error('Bàn không thuộc nhà hàng của bạn.')
      const qr = await getCurrentQr(
        table.tableId,
        table.tableCode,
        signal,
        restaurantId,
      )
      return { table, area, qr }
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
  const current = context.data?.qr
  const picture = useQuery({
    queryKey: [
      'manager-table-qr',
      restaurantId,
      actorId,
      'image',
      current?.qrId,
    ],
    queryFn: ({ signal }) => getQrImage(current!.qrId, signal),
    enabled: canManage && !!current,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    retry: false,
    mutationFn: () => issueTableQr(tableId, current?.qrId),
    onSuccess: (qr) => {
      void client.invalidateQueries({
        queryKey: [
          'manager-table-qr',
          restaurantId,
          actorId,
          'status',
          tableId,
        ],
      })
      client.setQueryData(
        ['manager-table-qr', restaurantId, actorId, 'table', tableId],
        (old: typeof context.data) => (old ? { ...old, qr } : old),
      )
      setConfirm(false)
      toast.success('Mã QR đã sẵn sàng.')
    },
  })
  const allowed =
    context.isSuccess &&
    !!context.data?.table.isActive &&
    !!context.data?.area.isActive
  async function reload() {
    const r = await context.refetch()
    if (r.isSuccess) {
      void client.invalidateQueries({
        queryKey: [
          'manager-table-qr',
          restaurantId,
          actorId,
          'status',
          tableId,
        ],
      })
      mutation.reset()
      setConfirm(false)
      void client.invalidateQueries({
        queryKey: ['manager-table-qr', restaurantId, actorId, 'image'],
      })
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
