import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOnlineRestaurants } from '../api/restaurantApi'

export function useOnlineRestaurants() {
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const [pagination, setPagination] = useState({ keyword: '', page: 1 })
  const pageSize = 6
  const page = pagination.keyword === keyword ? pagination.page : 1
  useEffect(() => {
    const timer = window.setTimeout(() => setKeyword(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])
  const restaurants = useQuery({
    queryKey: ['online-restaurants', { page, pageSize, search: keyword }],
    queryFn: ({ signal }) =>
      getOnlineRestaurants(page, pageSize, signal, keyword),
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  if (restaurants.isSuccess) {
    const lastPage = Math.max(
      1,
      Math.ceil(restaurants.data.totalCount / pageSize),
    )
    if (page > lastPage) setPagination({ keyword, page: lastPage })
  }
  function changeSearch(value: string) {
    setSearch(value)
    setPagination({ keyword: value.trim(), page: 1 })
  }
  function setPage(value: number) {
    setPagination({ keyword, page: value })
  }
  return { page, setPage, pageSize, restaurants, search, changeSearch }
}
