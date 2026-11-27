import { useMutation, useQuery } from '@tanstack/react-query'
import { getAllOnlineRestaurants } from '../../restaurants/api/restaurantApi'
import { createReservation } from '../api/reservationApi'

export function useReservation() {
  const restaurants = useQuery({
    queryKey: ['public-reservation-restaurants'],
    queryFn: ({ signal }) => getAllOnlineRestaurants(signal),
    retry: 1,
  })
  const create = useMutation({ mutationFn: createReservation, retry: false })
  return { restaurants, create }
}
