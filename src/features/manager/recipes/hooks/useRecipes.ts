import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/ingredientApi'

export function useRecipes(itemId: string, option = false) {
  return useQuery({
    queryKey: ['manager-inventory', 'recipes', itemId, option],
    queryFn: ({ signal }) => getRecipes(itemId, signal, option),
    enabled: Boolean(itemId),
  })
}
