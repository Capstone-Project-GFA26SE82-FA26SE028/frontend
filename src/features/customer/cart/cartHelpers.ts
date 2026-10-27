import type { CartLine, CustomerCart, QuotedItem } from './types/types'
export function optionKey(options: { optionId: string; quantity: number }[]) {
  return JSON.stringify(
    [...options]
      .sort((a, b) => a.optionId.localeCompare(b.optionId))
      .map((o) => [o.optionId, o.quantity]),
  )
}
export function sameCartLine(a: CartLine, b: CartLine) {
  return (
    a.itemId === b.itemId &&
    (a.note?.trim() || '') === (b.note?.trim() || '') &&
    optionKey(a.options) === optionKey(b.options)
  )
}
export function quotedItem(
  cart: CustomerCart,
  line: CartLine,
): QuotedItem | undefined {
  return cart.quote?.items.find(
    (q) =>
      q.itemId === line.itemId &&
      q.quantity === line.quantity &&
      optionKey(q.options) === optionKey(line.options),
  )
}
export function quotedUnitPrice(item: QuotedItem) {
  return (
    item.unitPrice +
    item.options.reduce((sum, o) => sum + o.extraPrice * o.quantity, 0)
  )
}
export function canReviewCart(cart: CustomerCart) {
  return (
    cart.items.length > 0 &&
    cart.quote?.isValid === true &&
    cart.quote.totalAmount !== null &&
    cart.items.every((line) => !!quotedItem(cart, line))
  )
}
