import { useQuery } from '@tanstack/react-query'
import { previewKitchen } from '../data/previewOperations'

export function useKitchenTasks() {
  return useQuery({
    queryKey: ['manager-operations-preview', 'kitchen'],
    queryFn: async () => previewKitchen(Date.now()),
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })
}
