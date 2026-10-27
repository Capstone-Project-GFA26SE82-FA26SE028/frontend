import axios from 'axios'
import type { CustomerCart, CartLine, CartResponse } from '../types/types'
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})
function result<T>(data: CartResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Unable to update your cart.')
  return data.result
}
function path(sessionId: string) {
  return '/table-sessions/' + encodeURIComponent(sessionId) + '/carts'
}
// Create returns the existing, unexpired cart owned by the current guest cookie.
export async function getOrCreateCart(sessionId: string, signal?: AbortSignal) {
  const { data } = await client.post<CartResponse<CustomerCart>>(
    path(sessionId),
    undefined,
    { signal },
  )
  return result(data)
}
export async function updateCart(
  sessionId: string,
  cart: CustomerCart,
  items: CartLine[],
) {
  const { data } = await client.put<CartResponse<CustomerCart>>(
    path(sessionId) + '/' + encodeURIComponent(cart.cartId),
    {
      version: cart.version,
      items: items.map((line) => ({
        itemId: line.itemId,
        quantity: line.quantity,
        note: line.note?.trim() || null,
        options: line.options.map((o) => ({
          optionId: o.optionId,
          quantity: o.quantity,
        })),
      })),
    },
  )
  return result(data)
}
export function cartError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Connection interrupted. Reload your cart to check whether the change was saved.'
    if ([401, 403].includes(error.response.status))
      return 'Table access expired. Scan the table QR code again.'
    if (error.response.status >= 500)
      return 'Cart service unavailable. Reload your cart before trying again.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to update your cart. Reload and try again.'
  }
  return error instanceof Error ? error.message : 'Unable to update your cart.'
}
