import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  catalogError,
  writeCatalog,
} from '../../menu-management/api/catalogApi'

export function useIngredientMutation(onSuccess?: () => void) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      method: 'post' | 'put' | 'patch'
      path: string
      body: unknown
    }) => writeCatalog(input.method, input.path, input.body),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['manager-inventory'] }),
        client.invalidateQueries({ queryKey: ['manager-catalog'] }),
      ])
      toast.success('Changes saved.')
      onSuccess?.()
    },
    onError: (error) => toast.error(catalogError(error)),
  })
}
