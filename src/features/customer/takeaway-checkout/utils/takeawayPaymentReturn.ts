const returnKey = 'takeaway-payment-return'
const orderPath = /^\/restaurants\/[a-f0-9-]{36}\/checkout\?order=[a-f0-9-]{36}$/i

export function saveTakeawayPaymentReturn(restaurantId: string, orderId: string, userId?: string) {
  if (!userId) return false

  try {
    const path = `/restaurants/${restaurantId}/checkout?order=${orderId}`
    sessionStorage.setItem(returnKey, JSON.stringify({ path, userId }))
    return true
  } catch {
    return false
  }
}

export function getTakeawayPaymentReturn(userId?: string) {
  let destination: string | undefined
  try {
    const saved = JSON.parse(sessionStorage.getItem(returnKey) ?? 'null')
    if (typeof saved?.userId === 'string' &&
        (!userId || saved.userId === userId) &&
        typeof saved.path === 'string' &&
        orderPath.test(saved.path)) {
      destination = saved.path
    }
  } catch {
    // The original order page may still be open in another tab.
  }

  return destination
}
