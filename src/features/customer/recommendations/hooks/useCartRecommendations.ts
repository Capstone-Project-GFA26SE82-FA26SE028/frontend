import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  getRecommendations,
  recommendationError,
} from '../api/recommendationApi'
import type { CartRecommendations } from '../types/types'

// The containing component is keyed by cart ID and version, so a cart change
// clears previous suggestions and cancels an in-flight model request.
export function useCartRecommendations(
  sessionId: string,
  cartId: string,
  version: string,
  disabled: boolean,
  autoRequested: { current: boolean },
) {
  const [result, setResult] = useState<CartRecommendations | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [needsReload, setNeedsReload] = useState(false)
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => request.current?.abort(), [])

  const load = useCallback(async () => {
    if (request.current) return
    const controller = new AbortController()
    request.current = controller
    setPending(true)
    setError('')
    setNeedsReload(false)
    setResult(null)
    try {
      const value = await getRecommendations(
        sessionId,
        cartId,
        controller.signal,
      )
      if (controller.signal.aborted) return
      if (value.cartVersion !== version) {
        setNeedsReload(true)
        setError('Giỏ hàng đã thay đổi. Vui lòng tải lại để lấy gợi ý mới.')
        return
      }
      setResult(value)
    } catch (cause) {
      if (controller.signal.aborted) return
      setNeedsReload(
        axios.isAxiosError(cause) && cause.response?.status === 409,
      )
      setError(recommendationError(cause))
    } finally {
      if (!controller.signal.aborted) {
        request.current = null
        setPending(false)
      }
    }
  }, [sessionId, cartId, version])

  useEffect(() => {
    if (disabled || autoRequested.current) return
    // Defer until mount settles so StrictMode does not send a duplicate request.
    const timer = window.setTimeout(() => {
      if (autoRequested.current) return
      autoRequested.current = true
      void load()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [disabled, autoRequested, load])
  return { result, pending, error, needsReload, load }
}
