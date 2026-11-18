import { axiosClient } from '../../../../api/axiosClient'
import type {
  TakeawayDish,
  TakeawayMenuPage,
  TakeawayResponse,
} from '../types/types'

export async function getTakeawayMenu(
  restaurantId: string,
  filters: { search: string; categoryId: string },
  signal: AbortSignal,
) {
  const items = new Map<string, TakeawayDish>()
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<TakeawayResponse<TakeawayMenuPage>>(
      '/menu',
      {
        signal,
        params: {
          restaurantId,
          channel: 'Takeaway',
          page,
          pageSize: 100,
          search: filters.search || undefined,
          categoryId: filters.categoryId || undefined,
        },
      },
    )
    if (!data.isSuccess)
      throw new Error(data.message || 'Không thể tải thực đơn.')
    const result = data.result
    for (const item of result.items) {
      if (item.channel !== 'Takeaway')
        throw new Error('Chưa nhận được giá mang đi. Vui lòng thử lại.')
      items.set(item.itemId, {
        ...item,
        preparationTimeMinutes: item.preparationTimeMinutes ?? null,
      })
    }
    if (
      !result.items.length ||
      result.page * result.pageSize >= result.totalCount
    )
      return [...items.values()]
  }
}
