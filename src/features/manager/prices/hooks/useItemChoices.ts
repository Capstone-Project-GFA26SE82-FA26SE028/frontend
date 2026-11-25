import { useQuery } from '@tanstack/react-query'
import { getChoices } from '../api/catalogApi'
import { itemSchema } from '../schemas/catalogSchema'

export function useItemChoices() {
  return useQuery({
    queryKey: ['manager-catalog', 'item-choices'],
    queryFn: ({ signal }) => getChoices('/items', itemSchema, signal),
  })
}
