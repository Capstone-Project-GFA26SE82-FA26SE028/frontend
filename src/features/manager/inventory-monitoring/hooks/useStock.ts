import { useQuery } from '@tanstack/react-query'
import { ingredientSchema } from '../../ingredient-management/schemas/ingredientSchema'
import { getChoices } from '../../menu-management/api/catalogApi'
import { lotSchema, movementSchema } from '../schemas/stockSchema'

export function useStock() {
  return useQuery({
    queryKey: ['manager-inventory', 'stock-overview'],
    queryFn: ({ signal }) =>
      getChoices('/ingredients', ingredientSchema, signal),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  })
}

export function useStockMovements(ingredientId: string) {
  return useQuery({
    queryKey: ['manager-inventory', 'stock-movements', ingredientId],
    queryFn: ({ signal }) =>
      getChoices(
        `/ingredients/${ingredientId}/stock-movements`,
        movementSchema,
        signal,
      ),
    enabled: Boolean(ingredientId),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  })
}

export function useStockLots(ingredientId: string) {
  return useQuery({
    queryKey: ['manager-inventory', 'stock-lots', ingredientId],
    queryFn: ({ signal }) =>
      getChoices(`/ingredients/${ingredientId}/lots`, lotSchema, signal),
    enabled: Boolean(ingredientId),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  })
}
