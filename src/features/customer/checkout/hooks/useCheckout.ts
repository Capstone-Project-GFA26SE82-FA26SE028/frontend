import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCustomerCart } from '../../cart/hooks/useCustomerCart'
import { canReviewCart } from '../../cart/cartHelpers'
import { isOrderRejected, submitOrder } from '../api/checkoutApi'
import type { CheckoutAttempt } from '../types/types'

export function useCheckout() {
  const management = useCustomerCart()
  const sessionId = management.table?.tableSessionId
  const storageKey = 'foodhub.checkout-attempt.' + sessionId
  const client = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const lock = useRef(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<CheckoutAttempt | null>(() => {
    try {
      const stored = sessionStorage.getItem(storageKey)
      return stored ? (JSON.parse(stored) as CheckoutAttempt) : null
    } catch {
      return null
    }
  })
  const mutation = useMutation({
    mutationKey: ['customer-cart-write', sessionId],
    retry: false,
    mutationFn: (pending: CheckoutAttempt) => submitOrder(sessionId!, pending),
    onSuccess: (order) => {
      // Keep the attempt until the receipt URL is recorded, so reloads remain safe.
      client.setQueryData(
        ['customer-checkout-order', sessionId, order.orderId],
        order,
      )
      navigate(
        {
          pathname: location.pathname,
          search: '?order=' + encodeURIComponent(order.orderId),
          hash: location.hash,
        },
        { replace: true },
      )
      sessionStorage.removeItem(storageKey)
      setAttempt(null)
      void client.invalidateQueries({ queryKey: ['customer-cart', sessionId] })
      void client.invalidateQueries({
        queryKey: ['customer-orders', sessionId],
      })
    },
  })
  async function placeOrder() {
    if (lock.current || management.pending || management.cart.isFetching) return
    lock.current = true
    setLocalError(null)
    try {
      let pending = attempt
      if (!pending) {
        const cart = management.cart.data
        if (
          !sessionId ||
          !cart ||
          !canReviewCart(cart) ||
          management.cart.isError
        )
          throw new Error('Reload and review your cart first.')
        pending = {
          key: crypto.randomUUID(),
          request: {
            cartId: cart.cartId,
            cartVersion: cart.version,
            tableId: management.table!.tableId,
            channel: 'DineIn',
            items: [],
          },
        }
        // Persist before sending. If storage is unavailable, do not risk a request
        // whose idempotency key cannot survive a reload.
        sessionStorage.setItem(storageKey, JSON.stringify(pending))
        setAttempt(pending)
      }
      await mutation.mutateAsync(pending)
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : 'Unable to submit your order.',
      )
    } finally {
      lock.current = false
    }
  }
  async function reviewAgain() {
    if (management.pending || !isOrderRejected(mutation.error)) return
    if (await management.reload()) {
      sessionStorage.removeItem(storageKey)
      setAttempt(null)
      mutation.reset()
      setLocalError(null)
    }
  }
  return { management, mutation, attempt, placeOrder, reviewAgain, localError }
}
