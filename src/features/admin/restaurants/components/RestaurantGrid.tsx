import { RestaurantCard } from './RestaurantCard'
import { EmptyState } from '../../components/AdminUI'
import type { Restaurant } from '../types'
export function RestaurantGrid({
  items,
  onView,
  onEdit,
}: {
  items: Restaurant[]
  onView: (id: string) => void
  onEdit: (id: string) => void
}) {
  if (!items.length)
    return (
      <EmptyState
        title="No restaurants found"
        description="Try another name or add your first restaurant."
      />
    )
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <RestaurantCard
          key={item.restaurantId}
          restaurant={item}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
