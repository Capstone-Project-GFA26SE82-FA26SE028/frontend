import {
  useMutation,
  useQuery,
  useQueryClient,
  useIsMutating,
} from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getOrCreateCart, updateCart } from '../api/cartApi'
import { sameCartLine } from '../cartHelpers'
import type { CartAction, CustomerCart } from '../types/types'
export function useCustomerCart() {
  const table = useAppSelector((s) => s.customerSession.table)
  const sessionId = table?.tableSessionId
  const client = useQueryClient()
  const key = ['customer-cart', sessionId]
  const mutationKey = ['customer-cart-write', sessionId]
  const pending = useIsMutating({ mutationKey }) > 0
  const cart = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const loaded = await getOrCreateCart(sessionId!, signal)
      if (loaded.tableSessionId !== sessionId)
        throw new Error(
          'The cart belongs to another table session. Scan your table QR again.',
        )
      return loaded
    },
    enabled: !!sessionId,
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationKey,
    retry: false,
    onMutate: async () => {
      await client.cancelQueries({ queryKey: key, exact: true })
    },
    mutationFn: async (action: CartAction) => {
      const current = client.getQueryData<CustomerCart>(key)
      if (!sessionId || !current || current.tableSessionId !== sessionId)
        throw new Error('Reload your cart before changing it.')
      if (action.kind !== 'add' && action.version !== current.version)
        throw new Error('The cart changed. Reload before saving.')
      let items = current.items.map((line) => ({
        ...line,
        options: line.options.map((o) => ({ ...o })),
      }))
      if (action.kind === 'add') {
        const matching = items.find((line) => sameCartLine(line, action.line))
        if (matching) {
          const quantity = matching.quantity + action.line.quantity
          if (quantity > 1000)
            throw new Error('Maximum quantity is 1000 per line.')
          matching.quantity = quantity
        } else {
          if (items.length >= 100)
            throw new Error('Your cart can contain at most 100 lines.')
          items.push(action.line)
        }
      } else if (action.kind === 'clear') items = []
      else {
        if (!items[action.index])
          throw new Error('This cart line has changed. Reload your cart.')
        if (action.kind === 'edit') items[action.index] = action.line
        else if (action.kind === 'remove' || action.quantity === 0)
          items.splice(action.index, 1)
        else items[action.index].quantity = action.quantity
      }
      return updateCart(sessionId, current, items)
    },
    onSuccess: (saved) => {
      client.setQueryData(key, saved)
    },
  })
  async function save(action: CartAction) {
    if (client.isMutating({ mutationKey }) > 0)
      throw new Error('A cart update is already in progress.')
    if (cart.isFetching || cart.isError || mutation.isError)
      throw new Error('Reload your cart before changing it.')
    return mutation.mutateAsync(action)
  }
  async function reload() {
    if (pending) return false
    const response = await cart.refetch()
    if (response.isSuccess) mutation.reset()
    return response.isSuccess
  }
  return { table, cart, save, reload, pending, mutation }
}
