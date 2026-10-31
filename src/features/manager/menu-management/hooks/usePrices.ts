import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { useQuery } from '@tanstack/react-query'
import { getPage } from '../api/catalogApi'
import { priceSchema } from '../schemas/catalogSchema'

export function usePrices(itemId: string, channel: string, page: number) {
  return useQuery({
    queryKey: ['manager-catalog', 'prices', itemId, channel, page],
    queryFn: ({ signal }) =>
      getPage(
        '/prices',
        priceSchema,
        {
          page,
          pageSize: PAGE_SIZE,
          itemId: itemId || undefined,
          channel: channel || undefined,
        },
        signal,
      ),
  })
}
