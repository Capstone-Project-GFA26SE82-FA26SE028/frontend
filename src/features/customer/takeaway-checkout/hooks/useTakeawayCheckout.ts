import axios from 'axios'
import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTakeawayCart } from '../../takeaway-cart/hooks/useTakeawayCart'
import { createTakeawayOrder, getTakeawayOrder, takeawayOrderError } from '../api/takeawayOrderApi'
import type { TakeawayOrderRequest } from '../types/types'

export function useTakeawayCheckout(
  restaurantId: string,
  userId: string | undefined,
  onCreated: (orderId: string) => void,
) {
  const { cart } = useTakeawayCart(restaurantId)
  const queryClient = useQueryClient()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState<{ key: string; request: TakeawayOrderRequest } | null>(null)
  const submitting = useRef(false)
  const quote = cart.data?.quote
  const canOrder = !!cart.data?.items.length && quote?.isValid && quote.totalAmount != null && !cart.isFetching && !cart.isError

  async function submitOrder(pickupName: string, pickupPhone: string) {
    if (submitting.current) return
    const existing = attempt
    const currentCart = cart.data
    if (!existing && (!canOrder || !currentCart)) return
    const request = existing?.request ?? (currentCart && {
      cartId: currentCart.cartId,
      cartVersion: currentCart.version,
      pickupName: pickupName.trim(),
      pickupPhone: pickupPhone.trim(),
    })
    if (!request) return
    const key = existing?.key ?? crypto.randomUUID()
    setAttempt({ key, request })
    submitting.current = true
    setPending(true)
    setError('')
    try {
      const order = await createTakeawayOrder(restaurantId, request, key)
      queryClient.setQueryData(['takeaway-order', userId, restaurantId, order.orderId], order)
      void queryClient.invalidateQueries({ queryKey: ['takeaway-cart', userId, restaurantId] })
      onCreated(order.orderId)
    } catch (cause) {
      if (axios.isAxiosError(cause) && [400, 401, 403, 404, 409, 422].includes(cause.response?.status ?? 0)) {
        setAttempt(null)
        if (cause.response?.status === 404 || cause.response?.status === 409) void cart.refetch()
      }
      setError(takeawayOrderError(cause))
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return { cart, quote, canOrder, pending, error, retrying: !!attempt, submitOrder }
}

export function useTakeawayOrder(restaurantId: string, orderId: string, userId?: string) {
  return useQuery({
    queryKey: ['takeaway-order', userId, restaurantId, orderId],
    queryFn: ({ signal }) => getTakeawayOrder(restaurantId, orderId, signal),
    retry: false,
    refetchInterval: ({ state }) =>
      ['PendingPayment', 'PendingConfirmation', 'Accepted', 'Cooking', 'ReadyForPickup'].includes(state.data?.status ?? '') ? 5000 : false,
  })
}
