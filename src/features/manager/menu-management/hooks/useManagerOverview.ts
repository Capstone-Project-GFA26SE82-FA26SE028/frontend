import { useQuery } from '@tanstack/react-query'
import { getPage } from '../api/catalogApi'
import {
  categorySchema,
  itemSchema,
  priceSchema,
} from '../schemas/catalogSchema'

export function useManagerOverview() {
  return useQuery({
    queryKey: ['manager-catalog', 'overview'],
    queryFn: async ({ signal }) => {
      const [categories, items, selling, prices] = await Promise.all([
        getPage(
          '/categories',
          categorySchema,
          { page: 1, pageSize: 1 },
          signal,
        ),
        getPage('/items', itemSchema, { page: 1, pageSize: 1 }, signal),
        getPage(
          '/items',
          itemSchema,
          { page: 1, pageSize: 1, availability: 'Available' },
          signal,
        ),
        getPage('/prices', priceSchema, { page: 1, pageSize: 1 }, signal),
      ])
      return {
        categories: categories.totalCount,
        items: items.totalCount,
        selling: selling.totalCount,
        prices: prices.totalCount,
      }
    },
  })
}
