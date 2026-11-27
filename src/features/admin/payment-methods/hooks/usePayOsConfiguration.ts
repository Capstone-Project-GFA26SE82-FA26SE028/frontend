import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPayOsConfiguration, payOsError, savePayOsConfiguration } from '../api/payOsApi'
import type { PayOsSettings } from '../types/types'

export function usePayOsConfiguration(restaurantId: string, userId: string) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const statusLock = useRef(false)
  const client = useQueryClient()
  const key = ['admin', 'payos', restaurantId, userId]
  const configuration = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getPayOsConfiguration(restaurantId, signal),
    enabled: !!restaurantId,
    retry: false,
  })

  async function save(values: PayOsSettings) {
    const saved = await savePayOsConfiguration(restaurantId, values)
    await client.cancelQueries({ queryKey: key, exact: true })
    client.setQueryData(key, saved)
    return saved
  }

  async function updateStatus(enabled: boolean) {
    const config = configuration.data
    if (statusLock.current || !config?.configured || enabled === config.enabled) return

    statusLock.current = true
    setUpdatingStatus(true)
    try {
      await save({
        clientId: config.clientId,
        apiKey: '',
        checksumKey: '',
        returnUrl: config.returnUrl,
        cancelUrl: config.cancelUrl,
        enabled,
      })
      toast.success(enabled ? 'Đã bật thanh toán PayOS.' : 'Đã tắt thanh toán PayOS.')
    } catch (cause) {
      toast.error(payOsError(cause))
    } finally {
      statusLock.current = false
      setUpdatingStatus(false)
    }
  }

  return { configuration, save, updateStatus, updatingStatus }
}
