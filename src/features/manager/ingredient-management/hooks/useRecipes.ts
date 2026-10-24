import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/ingredientApi'

export function useRecipes(itemId: string) {
  return useQuery({
    queryKey: ['manager-inventory', 'recipes', itemId],
    queryFn: ({ signal }) => getRecipes(itemId, signal),
    enabled: Boolean(itemId),
  })
}
