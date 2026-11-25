import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { useQuery } from '@tanstack/react-query'
import { getPage } from '../api/catalogApi'
import { itemSchema } from '../schemas/catalogSchema'

export function useItems(
  query: string,
  categoryId: string,
  status: string,
  page: number,
) {
  return useQuery({
    queryKey: ['manager-catalog', 'items', query, categoryId, status, page],
    queryFn: ({ signal }) =>
      getPage(
        '/items',
        itemSchema,
        {
          page,
          pageSize: PAGE_SIZE,
          search: query || undefined,
          categoryId: categoryId || undefined,
          availability: status || undefined,
        },
        signal,
      ),
  })
}
