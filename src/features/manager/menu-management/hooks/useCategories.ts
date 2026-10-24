import { useQuery } from '@tanstack/react-query'
import { getPage } from '../api/catalogApi'
import { categorySchema } from '../schemas/catalogSchema'

export function useCategories(query: string, status: string, page: number) {
  return useQuery({
    queryKey: ['manager-catalog', 'categories', query, status, page],
    queryFn: ({ signal }) =>
      getPage(
        '/categories',
        categorySchema,
        {
          page,
          pageSize: 10,
          search: query || undefined,
          isActive: status || undefined,
        },
        signal,
      ),
  })
}
