import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { catalogError, writeCatalog } from '../api/catalogApi'

export function useCatalogMutation(onSuccess?: () => void) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      method: 'post' | 'put' | 'patch' | 'delete'
      path: string
      body?: unknown
    }) => writeCatalog(input.method, input.path, input.body),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['manager-catalog'] })
      toast.success('Đã lưu thay đổi.')
      onSuccess?.()
    },
    onError: (error) => toast.error(catalogError(error)),
  })
}
