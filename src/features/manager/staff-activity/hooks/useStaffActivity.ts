import { useQuery } from '@tanstack/react-query'
import { previewActivity } from '../data/previewOperations'

export function useStaffActivity() {
  return useQuery({
    queryKey: ['manager-operations-preview', 'activity'],
    queryFn: async () => previewActivity(Date.now()),
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })
}
