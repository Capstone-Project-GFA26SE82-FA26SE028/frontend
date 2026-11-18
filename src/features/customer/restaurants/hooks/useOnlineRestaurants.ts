import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getAllOnlineRestaurants,
  getOnlineRestaurants,
} from '../api/restaurantApi'

export function useOnlineRestaurants() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const pageSize = 6
  const keyword = search
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLocaleLowerCase('vi-VN')
  const restaurants = useQuery({
    queryKey: [
      'online-restaurants',
      keyword ? { all: true } : { page, pageSize },
    ],
    queryFn: ({ signal }) =>
      keyword
        ? getAllOnlineRestaurants(signal)
        : getOnlineRestaurants(page, pageSize, signal),
    select: (data) => {
      if (!keyword) return data
      const items = data.items.filter((restaurant) =>
        (restaurant.restaurantName + ' ' + restaurant.address)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/gi, 'd')
          .toLocaleLowerCase('vi-VN')
          .includes(keyword),
      )
      return {
        items: items.slice((page - 1) * pageSize, page * pageSize),
        totalCount: items.length,
        page,
        pageSize,
      }
    },
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }
  return { page, setPage, pageSize, restaurants, search, changeSearch }
}
