import { Badge } from '../../../../components/Badge/Badge'
import { availabilityLabels } from '../constants/catalog'
import type { Item } from '../types/catalog'

export function ItemStatusBadge({ item }: { item: Item }) {
  return (
    <Badge
      tone={
        item.availability === 'Available'
          ? 'green'
          : item.availability === 'OutOfStock'
            ? 'amber'
            : 'slate'
      }
    >
      {availabilityLabels[item.availability]}
    </Badge>
  )
}
