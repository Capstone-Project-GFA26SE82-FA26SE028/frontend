import { useQuery } from '@tanstack/react-query'
import { getChoices } from '../api/catalogApi'
import { itemSchema } from '../schemas/catalogSchema'

export function useItemChoices(enabled = true) {
  return useQuery({
    queryKey: ['manager-catalog', 'item-choices'],
    enabled,
    queryFn: ({ signal }) => getChoices('/items', itemSchema, signal),
  })
}
