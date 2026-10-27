import axios from 'axios'
import { z } from 'zod'
import type { Dish } from '../types'
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})
const option = z.object({
  optionId: z.guid(),
  optionName: z.string(),
  extraPrice: z.number().finite().nonnegative(),
  availability: z.string(),
  canSelect: z.boolean(),
})
const group = z.object({
  optionGroupId: z.guid(),
  optionGroupName: z.string(),
  minSelection: z.number().int().nonnegative(),
  maxSelection: z.number().int().nonnegative(),
  options: z.array(option),
})
const dish: z.ZodType<Dish> = z.object({
  itemId: z.guid(),
  categoryId: z.guid(),
  categoryName: z.string(),
  itemCode: z.string(),
  itemName: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  availability: z.string(),
  price: z.number().finite().nonnegative().nullable(),
  priceId: z.guid().nullable(),
  channel: z.string(),
  evaluatedAt: z.string(),
  canOrder: z.boolean(),
  unavailableReason: z.string().nullable(),
  preparationTimeMinutes: z
    .number()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  optionGroups: z.array(group),
})
function result<T>(data: unknown, schema: z.ZodType<T>) {
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().nullish(),
      result: z.unknown(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Unable to load the menu.')
  return schema.parse(envelope.result)
}
export async function getMenu(
  sessionId: string,
  filters: { search: string; categoryId: string },
  signal?: AbortSignal,
) {
  const items = new Map<string, Dish>()
  for (let page = 1; ; page++) {
    const { data } = await client.get('/menu', {
      signal,
      params: {
        tableSessionId: sessionId,
        channel: 'DineIn',
        page,
        pageSize: 100,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
      },
    })
    const list = result(
      data,
      z.object({
        items: z.array(dish),
        totalCount: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
      }),
    )
    for (const item of list.items) items.set(item.itemId, item)
    if (!list.items.length || list.page * list.pageSize >= list.totalCount)
      return [...items.values()]
  }
}
export async function getMenuItem(
  sessionId: string,
  id: string,
  signal?: AbortSignal,
) {
  const { data } = await client.get('/menu/' + encodeURIComponent(id), {
    signal,
    params: { tableSessionId: sessionId, channel: 'DineIn' },
  })
  return result(data, dish)
}
export function menuError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to connect. Please try again.'
    if ([401, 403].includes(error.response.status))
      return 'Table access expired. Scan the QR code again to join.'
    if (error.response.status >= 500)
      return 'Menu service unavailable. Please try again later.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Unable to load the menu.'
  }
  return error instanceof z.ZodError
    ? 'Unexpected menu response.'
    : error instanceof Error
      ? error.message
      : 'Unable to load the menu.'
}
