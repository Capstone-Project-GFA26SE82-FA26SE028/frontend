import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { formatCurrency } from '../../../../utils/currency'
import { getBillPayOsPayment } from '../api/billApi'

type TrackedPayment = { table: string; billId: string }

function readWatchedPayments(key: string): Record<string, TrackedPayment | string> {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? '{}') ?? {}
  } catch {
    return {}
  }
}

export function usePayOsPaymentStatus(restaurantId: string, cashShiftId: string) {
  const client = useQueryClient()
  const storageKey = `cashier:watch-payos:${restaurantId}:${cashShiftId}`
  const [payments, setPayments] = useState(() => readWatchedPayments(storageKey))

  useEffect(() => {
    try {
      if (Object.keys(payments).length) {
        sessionStorage.setItem(storageKey, JSON.stringify(payments))
      } else {
        sessionStorage.removeItem(storageKey)
      }
    } catch {
      // In-memory tracking still works when session storage is unavailable.
    }
  }, [payments, storageKey])

  useEffect(() => {
    if (!Object.keys(payments).length) return

    const controller = new AbortController()
    let timer: number
    async function checkPayments() {
      const results = await Promise.allSettled(
        Object.entries(payments).map(async ([paymentId, entry]) => ({
          payment: await getBillPayOsPayment(paymentId, controller.signal),
          table: typeof entry === 'string' ? entry : entry.table,
        })),
      )
      if (controller.signal.aborted) return

      const finished: string[] = []
      for (const result of results) {
        if (result.status !== 'fulfilled') continue
        const { payment, table } = result.value
        if (payment.status === 'Paid' && payment.paidAt) {
          finished.push(payment.paymentId)
          toast.success(`${table} đã thanh toán ${formatCurrency(payment.amount)} qua PayOS.`, {
            toastId: payment.paymentId,
          })
          void client.invalidateQueries({ queryKey: ['cashier', 'bill-details', payment.billId] })
          void client.invalidateQueries({ queryKey: ['cashier', 'billing-queue', restaurantId, cashShiftId] })
          void client.invalidateQueries({ queryKey: ['cashier', 'billing-areas', restaurantId, cashShiftId] })
        } else if (payment.isVerifiedZero) {
          finished.push(payment.paymentId)
        }
      }
      if (finished.length) {
        setPayments((current) => {
          const remaining = { ...current }
          for (const paymentId of finished) delete remaining[paymentId]
          return remaining
        })
      } else {
        timer = window.setTimeout(() => void checkPayments(), 4000)
      }
    }
    timer = window.setTimeout(() => void checkPayments(), 4000)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [payments, client, restaurantId, cashShiftId])

  return (paymentId: string, table: string) => {
    setPayments((current) => current[paymentId] ? current : { ...current, [paymentId]: table })
  }
}
