import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getAllOnlineRestaurants } from '../../restaurants/api/restaurantApi'
import { getTakeawayMenu } from '../api/takeawayMenuApi'

export function useTakeawayMenu(restaurantId: string) {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const [search, setSearch] = useState('')
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  useEffect(() => {
    const timer = setTimeout(() => setTerm(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])
  const restaurant = useQuery({
    queryKey: ['online-restaurant', restaurantId],
    queryFn: async ({ signal }) => {
      const list = await getAllOnlineRestaurants(signal)
      const found = list.items.find(
        (item) => item.restaurantId.toLowerCase() === restaurantId,
      )
      if (!found) throw new Error('Không tìm thấy nhà hàng.')
      return found
    },
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  const query = (search: string, categoryId: string) => ({
    queryKey: ['takeaway-menu', userId, restaurantId, { search, categoryId }],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      getTakeawayMenu(restaurantId, { search, categoryId }, signal),
    enabled: !!userId && restaurant.isSuccess,
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  const catalogue = useQuery(query('', ''))
  const menu = useQuery(query(term, category))
  const dishes = menu.data ?? []
  const categories = [
    ...new Map(
      (catalogue.data ?? []).map((dish) => [
        dish.categoryId,
        dish.categoryName,
      ]),
    ).entries(),
  ]
  const visible = dishes
  const selected = dishes.find((dish) => dish.itemId === selectedId)
  return {
    restaurant,
    menu,
    search,
    setSearch,
    category,
    setCategory,
    categories,
    visible,
    selected,
    setSelectedId,
  }
}
