import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { kdsApi, kdsError, kdsReadPolicy } from '../api/kdsApi'

export function useRecipe(itemId: string) {
  const userId = useAppSelector((s) => s.auth.session?.user.userId)
  const recipe = useQuery({
    ...kdsReadPolicy,
    queryKey: ['kitchen-live', userId, 'recipe', itemId],
    queryFn: ({ signal }) => kdsApi.activeRecipe(itemId, signal),
    staleTime: 60000,
    retry: (count, error) =>
      axios.isAxiosError(error) && error.response?.status === 404
        ? false
        : kdsReadPolicy.retry(count, error),
  })
  const errorMessage =
    axios.isAxiosError(recipe.error) && recipe.error.response?.status === 404
      ? 'Món này chưa có công thức đang áp dụng.'
      : kdsError(recipe.error)

  return { ...recipe, errorMessage }
}
