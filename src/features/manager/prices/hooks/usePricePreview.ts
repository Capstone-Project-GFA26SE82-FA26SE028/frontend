import { useMutation } from '@tanstack/react-query'
import { appliedPrice } from '../api/catalogApi'

export function usePricePreview() {
  return useMutation({
    mutationFn: ({
      itemId,
      channel,
      at,
    }: {
      itemId: string
      channel: string
      at: string
    }) => appliedPrice(itemId, channel, at),
  })
}
