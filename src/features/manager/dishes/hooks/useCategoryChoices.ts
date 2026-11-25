import { useQuery } from '@tanstack/react-query'
import { getChoices } from '../api/catalogApi'
import { categorySchema } from '../schemas/catalogSchema'

export function useCategoryChoices() {
  return useQuery({
    queryKey: ['manager-catalog', 'category-choices'],
    queryFn: ({ signal }) => getChoices('/categories', categorySchema, signal),
  })
}
