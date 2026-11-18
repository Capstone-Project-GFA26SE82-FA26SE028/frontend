import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOnlineRestaurants } from '../api/restaurantApi'

export function useOnlineRestaurants() {
  const [page, setPage] = useState(1)
  const pageSize = 6
  const restaurants = useQuery({
    queryKey: ['online-restaurants', { page, pageSize }],
    queryFn: ({ signal }) => getOnlineRestaurants(page, pageSize, signal),
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  return { page, setPage, pageSize, restaurants }
}
