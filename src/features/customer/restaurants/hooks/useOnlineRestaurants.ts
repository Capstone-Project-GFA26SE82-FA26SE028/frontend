import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getOnlineRestaurants } from '../api/restaurantApi'

export function useOnlineRestaurants() {
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const pageSize = 9
  useEffect(() => {
    const timer = window.setTimeout(() => setKeyword(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])
  const restaurants = useInfiniteQuery({
    queryKey: [
      'online-restaurants',
      'load-more',
      { pageSize, search: keyword },
    ],
    initialPageParam: 1,
    queryFn: ({ signal, pageParam }) =>
      getOnlineRestaurants(pageParam, pageSize, signal, keyword),
    getNextPageParam: (lastPage) =>
      lastPage.items.length &&
      lastPage.page * lastPage.pageSize < lastPage.totalCount
        ? lastPage.page + 1
        : undefined,
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  const pages = restaurants.data?.pages ?? []
  const items = Array.from(
    new Map(
      pages
        .flatMap((page) => page.items)
        .map((item) => [item.restaurantId, item]),
    ).values(),
  )
  const totalCount = pages.at(-1)?.totalCount ?? 0
  const isSearching = search.trim() !== keyword || restaurants.isPending
  return {
    restaurants,
    items,
    totalCount,
    search,
    changeSearch: setSearch,
    isSearching,
  }
}
