import { useQuery } from '@tanstack/react-query'
import { getChoices, getPage } from '../../menu-management/api/catalogApi'
import { ingredientSchema } from '../schemas/ingredientSchema'

export function useIngredients(
  search: string,
  status: string,
  lowStockOnly: boolean,
  page: number,
) {
  return useQuery({
    queryKey: [
      'manager-inventory',
      'ingredients',
      search,
      status,
      lowStockOnly,
      page,
    ],
    queryFn: ({ signal }) =>
      getPage(
        '/ingredients',
        ingredientSchema,
        {
          page,
          pageSize: 10,
          search: search || undefined,
          isActive: status || undefined,
          lowStockOnly,
        },
        signal,
      ),
  })
}

export function useIngredientChoices() {
  return useQuery({
    queryKey: ['manager-inventory', 'ingredient-choices'],
    queryFn: ({ signal }) =>
      getChoices('/ingredients', ingredientSchema, signal),
  })
}
