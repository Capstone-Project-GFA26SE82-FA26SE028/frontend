import type { Ingredient } from '../../ingredient-management/types/ingredient'
import type { Movement } from '../types/stock'

export function stockStatus(ingredient: Ingredient) {
  if (ingredient.stockQuantity <= 0) return 'Out of stock'
  if (ingredient.isLowStock) return 'Low stock'
  return 'In stock'
}

export function filterMovements(
  movements: Movement[],
  from: string,
  until: string,
  type = '',
) {
  const start = from ? Date.parse(`${from}T00:00:00+07:00`) : -Infinity
  const end = until
    ? Date.parse(`${until}T00:00:00+07:00`) + 86400000
    : Infinity
  return movements
    .filter((movement) => {
      const at = Date.parse(movement.createdAt)
      return (
        at >= start && at < end && (!type || movement.movementType === type)
      )
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export function movementTotals(movements: Movement[]) {
  return movements.reduce(
    (totals, movement) => ({
      incoming: totals.incoming + Math.max(0, movement.quantityChange),
      outgoing: totals.outgoing + Math.max(0, -movement.quantityChange),
      net: totals.net + movement.quantityChange,
    }),
    { incoming: 0, outgoing: 0, net: 0 },
  )
}
