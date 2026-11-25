import { useQuery } from '@tanstack/react-query'
import { getConversions, getUnits } from '../api/ingredientApi'

export function useUnits() {
  return useQuery({
    queryKey: ['manager-inventory', 'units'],
    queryFn: ({ signal }) => getUnits(signal),
  })
}

export function useConversions(ingredientId: string) {
  return useQuery({
    queryKey: ['manager-inventory', 'conversions', ingredientId],
    queryFn: ({ signal }) => getConversions(ingredientId, signal),
    enabled: Boolean(ingredientId),
  })
}
