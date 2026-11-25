import { useQuery } from '@tanstack/react-query'
import { previewTables } from '../data/previewOperations'

export function useOperationsTables() {
  return useQuery({
    queryKey: ['manager-operations-preview', 'tables'],
    queryFn: async () => previewTables(),
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })
}
