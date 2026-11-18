import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import { store } from '../../../../app/store'
import {
  getTakeawayCart,
  takeawayCartError,
  updateTakeawayCart,
  clearTakeawayCart,
} from '../api/takeawayCartApi'
import type { TakeawayCart, TakeawayCartLine } from '../types/types'

export function useTakeawayCart(restaurantId: string, enabled = true) {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const client = useQueryClient()
  const key = ['takeaway-cart', userId, restaurantId]
  const lock = useRef(false)
  const [needsReload, setNeedsReload] = useState(false)
  const cart = useQuery({
    queryKey: key,
    queryFn: ({ signal }) =>
      getTakeawayCart(
        restaurantId,
        client.getQueryData<TakeawayCart>(key)?.cartId,
        signal,
      ),
    enabled: enabled && !!userId,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationFn: (request: {
      cartId: string
      version: string
      items: TakeawayCartLine[]
      clear?: boolean
      message: string
    }) =>
      request.clear
        ? clearTakeawayCart(restaurantId, request.cartId, request.version)
        : updateTakeawayCart(
            restaurantId,
            request.cartId,
            request.version,
            request.items,
          ),
    retry: false,
    onMutate: async () => {
      await client.cancelQueries({ queryKey: key })
    },
    onSuccess: (data, request) => {
      if (store.getState().auth.session?.user.userId !== userId) return
      client.setQueryData(key, data)
      toast.success(request.message, {
        toastId: 'takeaway-cart-added',
        autoClose: 2000,
      })
    },
    onError: () => setNeedsReload(true),
  })

  async function addItem(line: TakeawayCartLine) {
    const current = client.getQueryData<TakeawayCart>(key)
    if (lock.current || cart.isFetching)
      throw new Error('Vui lòng đợi giỏ hàng cập nhật xong.')
    if (!current || cart.isError || needsReload)
      throw new Error('Vui lòng tải lại giỏ hàng trước khi thêm món.')
    if (Date.parse(current.expiresAt) <= Date.now()) {
      setNeedsReload(true)
      throw new Error('Giỏ hàng đã hết hạn. Vui lòng tải lại.')
    }
    const optionKey = (item: TakeawayCartLine) =>
      JSON.stringify(
        [...item.options]
          .sort((a, b) => a.optionId.localeCompare(b.optionId))
          .map((option) => [option.optionId, option.quantity]),
      )
    const index = current.items.findIndex(
      (item) =>
        item.itemId === line.itemId &&
        (item.note?.trim() || '') === (line.note?.trim() || '') &&
        optionKey(item) === optionKey(line),
    )
    const items = current.items.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + line.quantity } : item,
    )
    if (index < 0) items.push(line)
    if (items.length > 100 || items.some((item) => item.quantity > 1000))
      throw new Error(
        'Giỏ hàng tối đa 100 dòng món, mỗi dòng tối đa 1000 phần.',
      )
    lock.current = true
    try {
      await mutation.mutateAsync({
        cartId: current.cartId,
        version: current.version,
        items,
        message: 'Đã thêm vào giỏ mang đi.',
      })
      return true
    } catch {
      return false
    } finally {
      lock.current = false
    }
  }

  async function changeItems(
    items: TakeawayCartLine[],
    version: string,
    clear = false,
  ) {
    const current = client.getQueryData<TakeawayCart>(key)
    if (lock.current || cart.isFetching) return false
    if (
      !current ||
      cart.isError ||
      needsReload ||
      current.version !== version ||
      Date.parse(current.expiresAt) <= Date.now()
    ) {
      setNeedsReload(true)
      return false
    }
    if (
      items.some(
        (line) =>
          !Number.isInteger(line.quantity) ||
          line.quantity < 1 ||
          line.quantity > 1000 ||
          (line.note?.length ?? 0) > 1000,
      )
    )
      throw new Error('Kiểm tra số lượng và ghi chú của món.')
    lock.current = true
    try {
      await mutation.mutateAsync({
        cartId: current.cartId,
        version,
        items,
        clear,
        message: clear ? 'Đã xóa giỏ hàng.' : 'Đã cập nhật giỏ hàng.',
      })
      return true
    } catch {
      return false
    } finally {
      lock.current = false
    }
  }

  async function reload() {
    if (lock.current) return
    const result = await cart.refetch()
    if (result.isSuccess) {
      setNeedsReload(false)
      mutation.reset()
    }
  }
  return {
    cart,
    addItem,
    changeItems,
    reload,
    pending: mutation.isPending,
    needsReload,
    error:
      needsReload && !mutation.isError
        ? 'Giỏ hàng cần được tải lại trước khi tiếp tục.'
        : mutation.isError
          ? takeawayCartError(mutation.error)
          : cart.isError
            ? takeawayCartError(cart.error)
            : '',
  }
}
